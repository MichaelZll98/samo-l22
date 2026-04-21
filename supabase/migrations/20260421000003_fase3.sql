-- ═══════════════════════════════════════════════════════════════════════════
-- FASE 3: Analytics, Gamification, Planner, Classifica
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Badge Definitions (seed table, no RLS) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS badge_definitions (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  icon         TEXT NOT NULL,          -- lucide icon name
  color        TEXT NOT NULL DEFAULT '#0055FF',
  category     TEXT NOT NULL DEFAULT 'general', -- general|study|social|milestone
  condition    JSONB NOT NULL DEFAULT '{}'::jsonb -- { type, threshold, ... }
);

-- ── User Badges ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id     TEXT NOT NULL REFERENCES badge_definitions(id),
  unlocked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

-- ── User Streaks ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak    INT  NOT NULL DEFAULT 0,
  max_streak        INT  NOT NULL DEFAULT 0,
  last_activity_at  DATE,
  weekly_streak     INT  NOT NULL DEFAULT 0,      -- weeks with at least 1 day
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── User Points / XP ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_points (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp       INT  NOT NULL DEFAULT 0,
  weekly_xp      INT  NOT NULL DEFAULT 0,
  level          INT  NOT NULL DEFAULT 1,
  level_name     TEXT NOT NULL DEFAULT 'Matricola',
  ai_xp_today    INT  NOT NULL DEFAULT 0,         -- cap 50/day
  ai_xp_date     DATE,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── XP Transactions Log ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS xp_transactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount     INT  NOT NULL,
  reason     TEXT NOT NULL,  -- 'quiz_completed' | 'flashcard_review' | 'pomodoro' | 'note_created' | 'material_upload' | 'ai_message'
  ref_id     UUID,           -- optional reference to the source row
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Weekly Goals ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_goals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start      DATE NOT NULL,                  -- always Monday
  study_hours     INT  NOT NULL DEFAULT 10,       -- target hours
  quiz_count      INT  NOT NULL DEFAULT 5,
  flashcard_count INT  NOT NULL DEFAULT 50,
  pomodoro_count  INT  NOT NULL DEFAULT 10,
  -- progress (updated via triggers / client)
  study_hours_done     INT NOT NULL DEFAULT 0,
  quiz_done            INT NOT NULL DEFAULT 0,
  flashcard_done       INT NOT NULL DEFAULT 0,
  pomodoro_done        INT NOT NULL DEFAULT 0,
  completed       BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (user_id, week_start)
);

-- ── Daily Study Stats (for heatmap & analytics) ───────────────────────────────
CREATE TABLE IF NOT EXISTS daily_study_stats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  study_date      DATE NOT NULL,
  study_minutes   INT  NOT NULL DEFAULT 0,
  quiz_count      INT  NOT NULL DEFAULT 0,
  flashcard_count INT  NOT NULL DEFAULT 0,
  pomodoro_count  INT  NOT NULL DEFAULT 0,
  notes_count     INT  NOT NULL DEFAULT 0,
  xp_earned       INT  NOT NULL DEFAULT 0,
  UNIQUE (user_id, study_date)
);

-- ── Daily Plans ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date   DATE NOT NULL,
  subject_id  UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  duration_min INT NOT NULL DEFAULT 30,
  priority    TEXT NOT NULL DEFAULT 'medium', -- low|medium|high
  type        TEXT NOT NULL DEFAULT 'study',  -- study|quiz|flashcard|review
  status      TEXT NOT NULL DEFAULT 'suggested', -- suggested|accepted|done|skipped
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan_date, title)
);

-- ── Leaderboard Snapshots (weekly) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start    DATE NOT NULL,
  weekly_xp     INT  NOT NULL DEFAULT 0,
  streak        INT  NOT NULL DEFAULT 0,
  badges_count  INT  NOT NULL DEFAULT 0,
  rank          INT,
  anonymous     BOOLEAN NOT NULL DEFAULT false,
  university    TEXT,
  course        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_study_stats(user_id, study_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON daily_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON leaderboard_snapshots(week_start, rank);

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE user_badges           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points           ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_study_stats     ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;

-- user_badges
CREATE POLICY "user_badges_select" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_badges_insert" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_streaks
CREATE POLICY "user_streaks_select" ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_streaks_upsert" ON user_streaks FOR ALL USING (auth.uid() = user_id);

-- user_points
CREATE POLICY "user_points_select" ON user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_points_upsert" ON user_points FOR ALL USING (auth.uid() = user_id);

-- xp_transactions
CREATE POLICY "xp_transactions_select" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "xp_transactions_insert" ON xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- weekly_goals
CREATE POLICY "weekly_goals_all" ON weekly_goals FOR ALL USING (auth.uid() = user_id);

-- daily_study_stats
CREATE POLICY "daily_stats_all" ON daily_study_stats FOR ALL USING (auth.uid() = user_id);

-- daily_plans
CREATE POLICY "daily_plans_all" ON daily_plans FOR ALL USING (auth.uid() = user_id);

-- leaderboard_snapshots - own rows + public anonymous rows
CREATE POLICY "leaderboard_own" ON leaderboard_snapshots FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "leaderboard_public" ON leaderboard_snapshots FOR SELECT USING (anonymous = true OR auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: Badge Definitions
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO badge_definitions (id, name, description, icon, color, category, condition) VALUES
  ('primo_passo',      'Primo Passo',       'Hai completato la tua prima sessione di studio',         'Play',         '#22C55E', 'general',   '{"type":"pomodoro_count","threshold":1}'),
  ('maratoneta',       'Maratoneta',        'Hai mantenuto uno streak di 7 giorni consecutivi',       'Flame',        '#F43F5E', 'general',   '{"type":"streak","threshold":7}'),
  ('inarrestabile',    'Inarrestabile',     'Hai mantenuto uno streak di 30 giorni consecutivi',      'Zap',          '#F59E0B', 'general',   '{"type":"streak","threshold":30}'),
  ('quiz_master',      'Quiz Master',       'Hai completato 100 quiz',                                'Brain',        '#7C3AED', 'study',     '{"type":"quiz_count","threshold":100}'),
  ('memoria_di_ferro', 'Memoria di Ferro',  'Hai rivisto 500 flashcard',                              'Layers3',      '#0055FF', 'study',     '{"type":"flashcard_count","threshold":500}'),
  ('pomodoro_pro',     'Pomodoro Pro',      'Hai completato 50 sessioni Pomodoro',                    'Timer',        '#EF4444', 'study',     '{"type":"pomodoro_count","threshold":50}'),
  ('bibliotecario',    'Bibliotecario',     'Hai caricato 20 materiali di studio',                    'FolderOpen',   '#8B5CF6', 'study',     '{"type":"material_count","threshold":20}'),
  ('scrittore',        'Scrittore',         'Hai creato 30 note',                                     'NotebookPen',  '#06B6D4', 'study',     '{"type":"note_count","threshold":30}'),
  ('amico_di_samo',    'Amico di Samo',     'Hai inviato 100 messaggi all''AI assistant Samo',        'MessageCircle','#5C8BFF', 'social',    '{"type":"ai_message_count","threshold":100}'),
  ('primo_esame',      'Primo Esame',       'Hai registrato il tuo primo esame superato',             'Award',        '#F59E0B', 'milestone', '{"type":"exam_count","threshold":1}'),
  ('meta_traguardo',   'Metà Traguardo',    'Hai completato il 50% dei CFU del tuo piano di studi',  'Target',       '#22C55E', 'milestone', '{"type":"cfu_percent","threshold":50}'),
  ('quasi_laureato',   'Quasi Laureato',    'Hai completato l''80% dei CFU del tuo piano di studi',  'GraduationCap','#0055FF', 'milestone', '{"type":"cfu_percent","threshold":80}'),
  ('condivisione',     'Condivisione',      'Hai condiviso il tuo primo appunto con la community',    'Share2',       '#10B981', 'social',    '{"type":"share_count","threshold":1}'),
  ('nottambulo',       'Nottambulo',        'Hai studiato dopo mezzanotte',                           'Moon',         '#6366F1', 'general',   '{"type":"late_night_session","threshold":1}'),
  ('mattiniero',       'Mattiniero',        'Hai studiato prima delle 7 del mattino',                 'Sunrise',      '#F59E0B', 'general',   '{"type":"early_morning_session","threshold":1}')
ON CONFLICT (id) DO NOTHING;
