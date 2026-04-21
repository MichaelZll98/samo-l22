-- Supabase Schema for Samo L-22

-- Drop if exists
DROP TABLE IF EXISTS user_subjects;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS profiles;

-- Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  university TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create Subjects Table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  cfu INTEGER NOT NULL,
  description TEXT
);

-- Enable RLS (Read-only for all authenticated users)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read subjects" ON subjects FOR SELECT TO authenticated USING (true);

-- Create Exams Table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  grade INTEGER,
  date DATE,
  status TEXT CHECK (status IN ('planned', 'passed')) DEFAULT 'planned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own exams" ON exams FOR ALL USING (auth.uid() = user_id);

-- Create User Subjects (tracking which subjects a user is studying)
CREATE TABLE user_subjects (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('studying', 'completed')) DEFAULT 'studying',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, subject_id)
);

-- Enable RLS
ALTER TABLE user_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subjects" ON user_subjects FOR ALL USING (auth.uid() = user_id);

-- Seeding L-22 Subjects
INSERT INTO subjects (name, cfu) VALUES
('Anatomia Umana', 9),
('Fisiologia', 9),
('Biomeccanica', 6),
('Teoria e Metodologia dell''Allenamento', 12),
('Pedagogia Generale', 6),
('Psicologia dello Sport', 6),
('Diritto Sportivo', 6),
('Nutrizione e Alimentazione', 6),
('Medicina dello Sport', 6),
('Fisiologia dell''Esercizio', 6),
('Attività Motorie Adattate', 6),
('Sociologia dello Sport', 6),
('Igiene e Medicina Preventiva', 6),
('Biochimica', 6);