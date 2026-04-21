-- ═══════════════════════════════════════════════════════════════════════════
-- FASE 4: AI Study Engine
-- Tabelle: material_chunks, ai_jobs, ai_outputs, document_embeddings
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Estensione pgvector (se disponibile) ──────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Material Chunks (testo estratto da documenti per retrieval) ───────────────
CREATE TABLE IF NOT EXISTS material_chunks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id   UUID NOT NULL REFERENCES study_materials(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_index   INTEGER NOT NULL DEFAULT 0,
  content       TEXT NOT NULL,
  token_count   INTEGER NOT NULL DEFAULT 0,
  topic         TEXT,                               -- argomento rilevato automaticamente
  page_ref      TEXT,                               -- riferimento pagina/sezione
  embedding     vector(1536),                       -- OpenAI ada-002 embedding
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_material_chunks_material ON material_chunks(material_id);
CREATE INDEX IF NOT EXISTS idx_material_chunks_user    ON material_chunks(user_id);
-- Indice ivfflat per ricerca vettoriale (attivare dopo inserimento dati)
-- CREATE INDEX ON material_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ── AI Jobs (coda job asincroni) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type        TEXT NOT NULL CHECK (job_type IN (
                    'parse_document',
                    'generate_quiz',
                    'generate_flashcards',
                    'generate_summary',
                    'document_qa'
                  )),
  status          TEXT NOT NULL DEFAULT 'queued' CHECK (status IN (
                    'queued', 'processing', 'completed', 'failed'
                  )),
  progress        INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  input_params    JSONB NOT NULL DEFAULT '{}'::jsonb,   -- parametri input
  error_message   TEXT,
  retry_count     INTEGER NOT NULL DEFAULT 0,
  max_retries     INTEGER NOT NULL DEFAULT 3,
  source_material_id UUID REFERENCES study_materials(id) ON DELETE SET NULL,
  source_note_id  UUID REFERENCES notes(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_jobs_user        ON ai_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status      ON ai_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_created     ON ai_jobs(created_at DESC);

-- ── AI Outputs (output delle generazioni AI) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_outputs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES ai_jobs(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  output_type     TEXT NOT NULL CHECK (output_type IN (
                    'quiz_questions',
                    'flashcards',
                    'summary',
                    'qa_answer',
                    'parsed_chunks'
                  )),
  content         JSONB NOT NULL,                   -- contenuto generato (strutturato)
  content_text    TEXT,                             -- versione testuale leggibile
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  saved_as        TEXT,                             -- 'quiz_set' | 'flashcard_deck' | 'note'
  saved_id        UUID,                             -- id dell'entita salvata
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_outputs_job  ON ai_outputs(job_id);
CREATE INDEX IF NOT EXISTS idx_ai_outputs_user ON ai_outputs(user_id);

-- ── Daily AI Usage (limiti utilizzo per utente) ───────────────────────────────
CREATE TABLE IF NOT EXISTS daily_ai_usage (
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  parse_count      INTEGER NOT NULL DEFAULT 0,
  generate_count   INTEGER NOT NULL DEFAULT 0,
  qa_count         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, usage_date)
);

-- ── Weak Topics (argomenti deboli rilevati dall'analisi performance) ──────────
CREATE TABLE IF NOT EXISTS weak_topics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id      UUID REFERENCES subjects(id) ON DELETE CASCADE,
  topic           TEXT NOT NULL,
  strength_score  NUMERIC(4,2) NOT NULL DEFAULT 50.0 CHECK (strength_score BETWEEN 0 AND 100),
  attempts        INTEGER NOT NULL DEFAULT 0,
  correct_rate    NUMERIC(4,2) NOT NULL DEFAULT 0.0,
  last_seen       DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject_id, topic)
);

CREATE INDEX IF NOT EXISTS idx_weak_topics_user ON weak_topics(user_id);

-- ── Aggiornamento quiz_sets: aggiungo source_material_id per tracciare origine ─
ALTER TABLE quiz_sets
  ADD COLUMN IF NOT EXISTS source_material_id UUID REFERENCES study_materials(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_note_id     UUID REFERENCES notes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS ai_generated       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ── Aggiornamento flashcard_decks: aggiungo source fields ─────────────────────
ALTER TABLE flashcard_decks
  ADD COLUMN IF NOT EXISTS source_material_id UUID REFERENCES study_materials(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_note_id     UUID REFERENCES notes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS ai_generated       BOOLEAN NOT NULL DEFAULT false;

-- ── RLS Policies ─────────────────────────────────────────────────────────────

ALTER TABLE material_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_outputs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_ai_usage  ENABLE ROW LEVEL SECURITY;
ALTER TABLE weak_topics     ENABLE ROW LEVEL SECURITY;

-- material_chunks
CREATE POLICY "Utente vede solo i propri chunk" ON material_chunks
  FOR ALL USING (auth.uid() = user_id);

-- ai_jobs
CREATE POLICY "Utente vede solo i propri job" ON ai_jobs
  FOR ALL USING (auth.uid() = user_id);

-- ai_outputs
CREATE POLICY "Utente vede solo i propri output" ON ai_outputs
  FOR ALL USING (auth.uid() = user_id);

-- daily_ai_usage
CREATE POLICY "Utente vede solo il proprio utilizzo" ON daily_ai_usage
  FOR ALL USING (auth.uid() = user_id);

-- weak_topics
CREATE POLICY "Utente vede solo i propri argomenti deboli" ON weak_topics
  FOR ALL USING (auth.uid() = user_id);

-- ── Funzione: aggiorna weak_topics dopo un tentativo quiz ─────────────────────
CREATE OR REPLACE FUNCTION update_weak_topics_from_attempt()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_topic TEXT;
  v_subject_id UUID;
BEGIN
  -- Recupera topic e subject dal quiz_set
  SELECT qs.topic, qs.subject_id
  INTO v_topic, v_subject_id
  FROM quiz_sets qs
  WHERE qs.id = NEW.quiz_set_id;

  IF v_topic IS NULL THEN RETURN NEW; END IF;

  -- Upsert weak_topics
  INSERT INTO weak_topics (user_id, subject_id, topic, attempts, correct_rate, strength_score, last_seen)
  VALUES (
    NEW.user_id,
    v_subject_id,
    v_topic,
    1,
    COALESCE(NEW.score_percent, 0),
    LEAST(100, GREATEST(0, COALESCE(NEW.score_percent, 0))),
    CURRENT_DATE
  )
  ON CONFLICT (user_id, subject_id, topic) DO UPDATE SET
    attempts       = weak_topics.attempts + 1,
    correct_rate   = (weak_topics.correct_rate * weak_topics.attempts + COALESCE(NEW.score_percent, 0)) / (weak_topics.attempts + 1),
    strength_score = LEAST(100, GREATEST(0,
      (weak_topics.strength_score * 0.7) + (COALESCE(NEW.score_percent, 0) * 0.3)
    )),
    last_seen      = CURRENT_DATE,
    updated_at     = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_weak_topics ON quiz_attempts;
CREATE TRIGGER trg_update_weak_topics
  AFTER UPDATE OF completed_at ON quiz_attempts
  FOR EACH ROW
  WHEN (NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL)
  EXECUTE FUNCTION update_weak_topics_from_attempt();

-- ── Funzione: incrementa contatore utilizzo giornaliero ───────────────────────
CREATE OR REPLACE FUNCTION increment_ai_usage(
  p_user_id UUID,
  p_type TEXT
) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_count INTEGER;
  v_limit INTEGER := 20;  -- limite giornaliero generazioni
BEGIN
  INSERT INTO daily_ai_usage (user_id, usage_date)
  VALUES (p_user_id, CURRENT_DATE)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  IF p_type = 'parse' THEN
    UPDATE daily_ai_usage SET parse_count = parse_count + 1
    WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
  ELSIF p_type = 'generate' THEN
    SELECT generate_count INTO v_count
    FROM daily_ai_usage
    WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
    IF v_count >= v_limit THEN RETURN FALSE; END IF;
    UPDATE daily_ai_usage SET generate_count = generate_count + 1
    WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
  ELSIF p_type = 'qa' THEN
    UPDATE daily_ai_usage SET qa_count = qa_count + 1
    WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
  END IF;

  RETURN TRUE;
END;
$$;

-- ── Seed: weak topics di esempio per demo ─────────────────────────────────────
-- (verranno popolati automaticamente dai trigger quiz_attempts)
