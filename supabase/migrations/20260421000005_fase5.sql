-- ═══════════════════════════════════════════════════════════════════════════
-- FASE 5: Community e Condivisione tra studenti
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Shared Notes ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shared_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id         UUID REFERENCES notes(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL DEFAULT '',
  subject_id      UUID REFERENCES subjects(id) ON DELETE SET NULL,
  subject_name    TEXT,                          -- denormalized for display
  tags            TEXT[]   NOT NULL DEFAULT '{}',
  visibility      TEXT     NOT NULL DEFAULT 'public', -- public | group | private
  group_id        UUID,                          -- FK added after study_groups table
  rating_sum      INT      NOT NULL DEFAULT 0,
  rating_count    INT      NOT NULL DEFAULT 0,
  view_count      INT      NOT NULL DEFAULT 0,
  save_count      INT      NOT NULL DEFAULT 0,
  like_count      INT      NOT NULL DEFAULT 0,
  comment_count   INT      NOT NULL DEFAULT 0,
  status          TEXT     NOT NULL DEFAULT 'active', -- active | removed | hidden
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Shared Materials ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shared_materials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id     UUID REFERENCES study_materials(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  file_url        TEXT,
  file_type       TEXT,                          -- pdf | pptx | docx | img | other
  subject_id      UUID REFERENCES subjects(id) ON DELETE SET NULL,
  subject_name    TEXT,
  tags            TEXT[]   NOT NULL DEFAULT '{}',
  visibility      TEXT     NOT NULL DEFAULT 'public',
  group_id        UUID,
  download_count  INT      NOT NULL DEFAULT 0,
  like_count      INT      NOT NULL DEFAULT 0,
  save_count      INT      NOT NULL DEFAULT 0,
  comment_count   INT      NOT NULL DEFAULT 0,
  status          TEXT     NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Study Groups ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  subject_id      UUID REFERENCES subjects(id) ON DELETE SET NULL,
  subject_name    TEXT,
  cover_color     TEXT NOT NULL DEFAULT '#0055FF',
  invite_code     TEXT UNIQUE NOT NULL DEFAULT upper(substring(gen_random_uuid()::text, 1, 8)),
  max_members     INT  NOT NULL DEFAULT 50,
  member_count    INT  NOT NULL DEFAULT 1,
  is_public       BOOLEAN NOT NULL DEFAULT true,
  status          TEXT NOT NULL DEFAULT 'active', -- active | archived
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK from shared content to groups
ALTER TABLE shared_notes     ADD CONSTRAINT fk_shared_notes_group     FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE SET NULL;
ALTER TABLE shared_materials ADD CONSTRAINT fk_shared_materials_group FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE SET NULL;

-- ── Group Members ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member', -- owner | moderator | member
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

-- ── Group Messages (Chat) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text', -- text | file | system
  file_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Comments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type    TEXT NOT NULL, -- shared_note | shared_material
  content_id      UUID NOT NULL,
  parent_id       UUID REFERENCES comments(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  like_count      INT  NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Reactions (likes, saves, ratings) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type    TEXT NOT NULL, -- shared_note | shared_material | comment | group
  content_id      UUID NOT NULL,
  reaction_type   TEXT NOT NULL, -- like | save | rating
  rating_value    INT,           -- 1–5, only when reaction_type = 'rating'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, content_type, content_id, reaction_type)
);

-- ── Reports ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type    TEXT NOT NULL, -- shared_note | shared_material | comment | group_message
  content_id      UUID NOT NULL,
  reason          TEXT NOT NULL, -- spam | inappropriate | copyright | other
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- pending | reviewed | removed | dismissed
  reviewed_by     UUID REFERENCES auth.users(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL, -- like | comment | save | group_invite | group_join | report_reviewed
  actor_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content_type    TEXT,          -- shared_note | shared_material | study_group
  content_id      UUID,
  message         TEXT NOT NULL,
  read            BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Public Profiles ───────────────────────────────────────────────────────────
-- Extends the existing profiles table with community-visibility settings
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS public_profile   BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS public_stats     BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS bio              TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url       TEXT;

-- ═══════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_shared_notes_user       ON shared_notes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_notes_subject    ON shared_notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_shared_notes_visibility ON shared_notes(visibility, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_notes_rating     ON shared_notes(rating_sum, rating_count) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_shared_notes_group      ON shared_notes(group_id) WHERE group_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_shared_materials_user   ON shared_materials(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_materials_vis    ON shared_materials(visibility, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_materials_subject ON shared_materials(subject_id);

CREATE INDEX IF NOT EXISTS idx_study_groups_public     ON study_groups(is_public, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_groups_subject    ON study_groups(subject_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group     ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user      ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_group    ON group_messages(group_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_comments_content        ON comments(content_type, content_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_user           ON comments(user_id);

CREATE INDEX IF NOT EXISTS idx_reactions_user_content  ON reactions(user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_reactions_content       ON reactions(content_type, content_id, reaction_type);

CREATE INDEX IF NOT EXISTS idx_reports_status          ON reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user      ON notifications(user_id, read, created_at DESC);

-- Full-text search on shared notes
ALTER TABLE shared_notes ADD COLUMN IF NOT EXISTS fts tsvector;
CREATE OR REPLACE FUNCTION shared_notes_fts_update() RETURNS trigger AS $$
BEGIN
  NEW.fts := to_tsvector('simple', coalesce(NEW.title,'') || ' ' || coalesce(NEW.content,'') || ' ' || coalesce(NEW.subject_name,'') || ' ' || coalesce(array_to_string(NEW.tags,' '),''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER shared_notes_fts_trigger BEFORE INSERT OR UPDATE ON shared_notes
  FOR EACH ROW EXECUTE FUNCTION shared_notes_fts_update();
CREATE INDEX IF NOT EXISTS idx_shared_notes_fts ON shared_notes USING gin(fts);

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE shared_notes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_materials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups      ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;

-- shared_notes: public notes readable by all; group notes only by members
CREATE POLICY "shared_notes_select_public" ON shared_notes FOR SELECT
  USING (status = 'active' AND visibility = 'public');

CREATE POLICY "shared_notes_select_group" ON shared_notes FOR SELECT
  USING (
    status = 'active' AND visibility = 'group' AND
    group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "shared_notes_select_own" ON shared_notes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "shared_notes_insert" ON shared_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "shared_notes_update_own" ON shared_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "shared_notes_delete_own" ON shared_notes FOR DELETE
  USING (auth.uid() = user_id);

-- shared_materials
CREATE POLICY "shared_materials_select_public" ON shared_materials FOR SELECT
  USING (status = 'active' AND visibility = 'public');

CREATE POLICY "shared_materials_select_group" ON shared_materials FOR SELECT
  USING (
    status = 'active' AND visibility = 'group' AND
    group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "shared_materials_select_own" ON shared_materials FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "shared_materials_insert" ON shared_materials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "shared_materials_update_own" ON shared_materials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "shared_materials_delete_own" ON shared_materials FOR DELETE
  USING (auth.uid() = user_id);

-- study_groups: public groups viewable by all; private only by members
CREATE POLICY "study_groups_select_public" ON study_groups FOR SELECT
  USING (is_public = true AND status = 'active');

CREATE POLICY "study_groups_select_member" ON study_groups FOR SELECT
  USING (id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()));

CREATE POLICY "study_groups_insert" ON study_groups FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "study_groups_update_owner" ON study_groups FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "study_groups_delete_owner" ON study_groups FOR DELETE
  USING (auth.uid() = owner_id);

-- group_members
CREATE POLICY "group_members_select" ON group_members FOR SELECT
  USING (
    group_id IN (SELECT id FROM study_groups WHERE is_public = true)
    OR user_id = auth.uid()
    OR group_id IN (SELECT group_id FROM group_members gm WHERE gm.user_id = auth.uid())
  );

CREATE POLICY "group_members_insert" ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "group_members_delete_own" ON group_members FOR DELETE
  USING (auth.uid() = user_id);

-- group_messages: only members of the group
CREATE POLICY "group_messages_select" ON group_messages FOR SELECT
  USING (group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()));

CREATE POLICY "group_messages_insert" ON group_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  );

-- comments: public content readable by all authenticated
CREATE POLICY "comments_select" ON comments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "comments_insert" ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_own" ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_own" ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- reactions
CREATE POLICY "reactions_select" ON reactions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "reactions_insert" ON reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reactions_delete_own" ON reactions FOR DELETE
  USING (auth.uid() = user_id);

-- reports
CREATE POLICY "reports_insert" ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_select_own" ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- notifications: private per user
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert" ON notifications FOR INSERT
  WITH CHECK (true);  -- inserted server-side via trigger

-- ═══════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTION: auto-hide after N reports
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION check_auto_hide_content()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  report_threshold INT := 5;
  report_ct INT;
BEGIN
  SELECT count(*) INTO report_ct
  FROM reports
  WHERE content_type = NEW.content_type
    AND content_id   = NEW.content_id
    AND status       = 'pending';

  IF report_ct >= report_threshold THEN
    IF NEW.content_type = 'shared_note' THEN
      UPDATE shared_notes SET status = 'hidden' WHERE id = NEW.content_id;
    ELSIF NEW.content_type = 'shared_material' THEN
      UPDATE shared_materials SET status = 'hidden' WHERE id = NEW.content_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_hide_content
AFTER INSERT ON reports
FOR EACH ROW EXECUTE FUNCTION check_auto_hide_content();

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: Sample invite code helper view
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW community_feed AS
SELECT
  'note'              AS content_type,
  sn.id,
  sn.user_id,
  coalesce(p.university, 'Studente')  AS author_name,
  sn.title,
  sn.subject_name,
  sn.tags,
  sn.like_count,
  sn.save_count,
  sn.comment_count,
  sn.view_count,
  CASE WHEN sn.rating_count > 0
    THEN round(sn.rating_sum::numeric / sn.rating_count, 1)
    ELSE NULL
  END                 AS avg_rating,
  sn.created_at
FROM shared_notes sn
JOIN profiles p ON p.id = sn.user_id
WHERE sn.visibility = 'public' AND sn.status = 'active'

UNION ALL

SELECT
  'material'          AS content_type,
  sm.id,
  sm.user_id,
  coalesce(p.university, 'Studente')  AS author_name,
  sm.title,
  sm.subject_name,
  sm.tags,
  sm.like_count,
  sm.save_count,
  sm.comment_count,
  0                   AS view_count,
  NULL                AS avg_rating,
  sm.created_at
FROM shared_materials sm
JOIN profiles p ON p.id = sm.user_id
WHERE sm.visibility = 'public' AND sm.status = 'active';
