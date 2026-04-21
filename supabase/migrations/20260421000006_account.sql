-- ═══════════════════════════════════════════════════════════════════════════
-- ACCOUNT: Profilo esteso, Abbonamenti, Donazioni
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Extend profiles table ──────────────────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name   TEXT,
  ADD COLUMN IF NOT EXISTS last_name    TEXT,
  ADD COLUMN IF NOT EXISTS matricola    TEXT,
  ADD COLUMN IF NOT EXISTS corso_laurea TEXT NOT NULL DEFAULT 'L-22 Scienze Motorie',
  ADD COLUMN IF NOT EXISTS anno_corso   INTEGER NOT NULL DEFAULT 1
                                        CHECK (anno_corso IN (1, 2, 3, 99)),
  ADD COLUMN IF NOT EXISTS preferences  JSONB NOT NULL DEFAULT '{}'::jsonb;

-- NOTE: bio and avatar_url already added in fase5 migration

-- ── User Subscriptions ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                    TEXT NOT NULL DEFAULT 'free'
                          CHECK (plan IN ('free', 'pro')),
  status                  TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  payment_provider        TEXT,          -- stripe | paypal | apple | google
  provider_subscription_id TEXT,
  billing_interval        TEXT
                          CHECK (billing_interval IN ('monthly', 'yearly')),
  amount_cents            INTEGER,       -- 499 = €4.99, 2999 = €29.99
  started_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at              TIMESTAMPTZ,
  cancelled_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_insert_own" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_update_own" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- ── Donations ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_cents         INTEGER NOT NULL,
  currency             TEXT NOT NULL DEFAULT 'EUR',
  message              TEXT,
  payment_provider     TEXT,             -- stripe | paypal
  provider_payment_id  TEXT,
  status               TEXT NOT NULL DEFAULT 'completed'
                       CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  is_anonymous         BOOLEAN NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "donations_select_own" ON donations
  FOR SELECT USING (auth.uid() = user_id);

-- Allow inserts from authenticated users (server validates amounts)
CREATE POLICY "donations_insert_auth" ON donations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── Donation aggregate view ────────────────────────────────────────────────
CREATE OR REPLACE VIEW donation_stats AS
SELECT
  COUNT(*)                                                              AS total_donations,
  COALESCE(SUM(amount_cents), 0)                                        AS total_amount_cents,
  COALESCE(SUM(amount_cents) FILTER (
    WHERE created_at >= now() - interval '30 days'), 0)                 AS monthly_amount_cents
FROM donations
WHERE status = 'completed';

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user
  ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan
  ON user_subscriptions(plan, status);
CREATE INDEX IF NOT EXISTS idx_donations_user
  ON donations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status
  ON donations(status, created_at DESC);

-- ── Preferences schema comment ─────────────────────────────────────────────
-- preferences JSONB structure:
-- {
--   "pomodoro_duration": 25,          -- 15 | 25 | 30 | 45
--   "daily_study_goal_minutes": 120,
--   "language": "it",
--   "theme": "system",               -- light | dark | system
--   "notifications": {
--     "studio_reminder": true,
--     "scadenze_esami": true,
--     "flashcard_review": true,
--     "community": false
--   }
-- }
COMMENT ON COLUMN profiles.preferences IS
  'User study preferences: pomodoro_duration, daily_study_goal_minutes, language, theme, notifications JSONB';
