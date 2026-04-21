-- Fase 2 schema: notes, quiz, flashcards, materiali, tracking

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  folder TEXT,
  pinned BOOLEAN NOT NULL DEFAULT false,
  search_vector tsvector,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_search_vector ON notes USING GIN(search_vector);

CREATE OR REPLACE FUNCTION notes_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', coalesce(NEW.title, '') || ' ' || coalesce(NEW.content, '') || ' ' || array_to_string(NEW.tags, ' '));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER notes_search_vector_trigger BEFORE INSERT OR UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION notes_search_vector_update();

CREATE TABLE IF NOT EXISTS quiz_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('facile', 'medio', 'difficile')),
  mode_default TEXT NOT NULL DEFAULT 'practice' CHECK (mode_default IN ('practice', 'simulation')),
  timer_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_set_id UUID NOT NULL REFERENCES quiz_sets(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false')),
  prompt TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_set_id UUID NOT NULL REFERENCES quiz_sets(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'simulation')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  score_percent NUMERIC(5,2),
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER
);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN NOT NULL,
  explanation_snapshot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  topic TEXT,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_user ON flashcard_decks(user_id);

CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  easiness NUMERIC(4,2) NOT NULL DEFAULT 2.50,
  interval INTEGER NOT NULL DEFAULT 1,
  repetitions INTEGER NOT NULL DEFAULT 0,
  due_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_flashcards_due_at ON flashcards(due_at);

CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'ppt', 'image')),
  file_size BIGINT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_study_materials_user ON study_materials(user_id);

CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('notes', 'quiz', 'flashcards', 'pomodoro', 'reading')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  study_session_id UUID REFERENCES study_sessions(id) ON DELETE SET NULL,
  mode TEXT NOT NULL CHECK (mode IN ('focus', 'short_break', 'long_break')),
  planned_seconds INTEGER NOT NULL,
  actual_seconds INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notes_own_all" ON notes;
CREATE POLICY "notes_own_all" ON notes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "quiz_sets_read_all" ON quiz_sets;
CREATE POLICY "quiz_sets_read_all" ON quiz_sets FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "quiz_questions_read_all" ON quiz_questions;
CREATE POLICY "quiz_questions_read_all" ON quiz_questions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "quiz_attempts_own_all" ON quiz_attempts;
CREATE POLICY "quiz_attempts_own_all" ON quiz_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "quiz_answers_own_all" ON quiz_answers;
CREATE POLICY "quiz_answers_own_all" ON quiz_answers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM quiz_attempts qa
    WHERE qa.id = quiz_answers.attempt_id AND qa.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM quiz_attempts qa
    WHERE qa.id = quiz_answers.attempt_id AND qa.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "flashcard_decks_own_all" ON flashcard_decks;
CREATE POLICY "flashcard_decks_own_all" ON flashcard_decks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "flashcards_own_all" ON flashcards;
CREATE POLICY "flashcards_own_all" ON flashcards
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM flashcard_decks fd
    WHERE fd.id = flashcards.deck_id AND fd.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM flashcard_decks fd
    WHERE fd.id = flashcards.deck_id AND fd.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "study_materials_own_all" ON study_materials;
CREATE POLICY "study_materials_own_all" ON study_materials FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "study_sessions_own_all" ON study_sessions;
CREATE POLICY "study_sessions_own_all" ON study_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pomodoro_sessions_own_all" ON pomodoro_sessions;
CREATE POLICY "pomodoro_sessions_own_all" ON pomodoro_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

INSERT INTO quiz_sets (id, subject_id, topic, title, difficulty, mode_default, timer_seconds)
SELECT
  '11111111-1111-1111-1111-111111111111'::uuid,
  s.id,
  'Anatomia generale',
  'Quiz Anatomia Scienze Motorie - Set Base',
  'medio',
  'practice',
  1800
FROM subjects s
WHERE s.name = 'Anatomia Umana'
ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_questions (quiz_set_id, question_type, prompt, options, correct_answer, explanation, position) VALUES
('11111111-1111-1111-1111-111111111111', 'multiple_choice', 'Quale piano anatomico divide il corpo in destra e sinistra?', '["Frontale","Trasversale","Sagittale","Obliquo"]'::jsonb, 'Sagittale', 'Il piano sagittale separa il corpo in porzione destra e sinistra.', 1),
('11111111-1111-1111-1111-111111111111', 'multiple_choice', 'Quale articolazione e classificata come diartrosi?', '["Sinfisi pubica","Sutura cranica","Gleno-omerale","Sincondrosi"]'::jsonb, 'Gleno-omerale', 'La gleno-omerale e una sinoviale ad ampia mobilita, quindi diartrosi.', 2),
('11111111-1111-1111-1111-111111111111', 'true_false', 'Il muscolo quadricipite femorale estende il ginocchio.', '["Vero","Falso"]'::jsonb, 'Vero', 'Il quadricipite e il principale estensore del ginocchio.', 3),
('11111111-1111-1111-1111-111111111111', 'multiple_choice', 'Quale osso NON appartiene al cingolo scapolare?', '["Clavicola","Scapola","Omero","Nessuno dei precedenti"]'::jsonb, 'Omero', 'Il cingolo scapolare comprende clavicola e scapola, non l''omero.', 4),
('11111111-1111-1111-1111-111111111111', 'true_false', 'La contrazione eccentrica produce tensione mentre il muscolo si allunga.', '["Vero","Falso"]'::jsonb, 'Vero', 'In fase eccentrica il muscolo controlla il carico allungandosi.', 5)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', false)
ON CONFLICT (id) DO NOTHING;