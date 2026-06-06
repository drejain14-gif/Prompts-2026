-- SweatJoy Student Mental Wellness Tracker
-- Initial Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('student', 'parent', 'mentor', 'admin');
CREATE TYPE exam_type AS ENUM ('NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'SSC', 'Board Exams');
CREATE TYPE emotion_type AS ENUM ('happy', 'calm', 'motivated', 'nervous', 'stressed', 'overwhelmed', 'burned_out');
CREATE TYPE trigger_category AS ENUM (
  'exam_pressure', 'mock_test_results', 'study_backlog', 'social_media',
  'family_expectations', 'relationships', 'sleep_issues', 'financial_concerns', 'health_concerns'
);
CREATE TYPE burnout_risk AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE habit_type AS ENUM ('water', 'exercise', 'meditation', 'sleep', 'outdoor', 'study');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER CHECK (age >= 10 AND age <= 35),
  gender TEXT,
  exam_type exam_type NOT NULL DEFAULT 'NEET',
  target_exam_date DATE NOT NULL,
  study_hours_per_day NUMERIC(4,1) DEFAULT 6,
  role user_role NOT NULL DEFAULT 'student',
  wellness_score NUMERIC(5,2),
  xp_points INTEGER DEFAULT 0,
  achievement_level INTEGER DEFAULT 1,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  parent_opt_in BOOLEAN DEFAULT FALSE,
  mentor_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_exam_type ON profiles(exam_type);
CREATE INDEX idx_profiles_mentor ON profiles(mentor_id);

-- Parent-Student relationships
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  can_view_reports BOOLEAN DEFAULT TRUE,
  can_receive_alerts BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- Mood entries
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
  emotion emotion_type NOT NULL,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
  notes TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, entry_date DESC);

-- Stress triggers
CREATE TABLE triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category trigger_category NOT NULL,
  custom_label TEXT,
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 10) DEFAULT 5,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_triggers_user_category ON triggers(user_id, category);
CREATE INDEX idx_triggers_occurred ON triggers(user_id, occurred_at DESC);

-- Journals
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  emoji_reflection TEXT,
  voice_url TEXT,
  is_draft BOOLEAN DEFAULT FALSE,
  sentiment_score NUMERIC(4,3),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journals_user_date ON journals(user_id, entry_date DESC);
CREATE INDEX idx_journals_search ON journals USING gin(to_tsvector('english', content));

-- Habit logs
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_type habit_type NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  value NUMERIC(6,2),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, habit_type, log_date)
);

CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, log_date DESC);

-- Wellness scores
CREATE TABLE wellness_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
  assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wellness_scores_user ON wellness_scores(user_id, assessed_at DESC);

-- Burnout scores
CREATE TABLE burnout_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  risk_level burnout_risk NOT NULL,
  factors JSONB NOT NULL DEFAULT '{}',
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_burnout_scores_user ON burnout_scores(user_id, calculated_at DESC);
CREATE INDEX idx_burnout_risk ON burnout_scores(risk_level);

-- Recommendations
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT DEFAULT 'ai' CHECK (source IN ('ai', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recommendations_user ON recommendations(user_id, created_at DESC);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_key)
);

CREATE INDEX idx_achievements_user ON achievements(user_id);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  channel TEXT DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'push', 'whatsapp')),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

-- Study-life balance logs
CREATE TABLE study_balance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  study_hours NUMERIC(4,1) NOT NULL,
  break_hours NUMERIC(4,1) NOT NULL,
  sleep_hours NUMERIC(4,1) NOT NULL,
  balance_score NUMERIC(5,2),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- Counsellor reports
CREATE TABLE counsellor_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  counsellor_id UUID NOT NULL REFERENCES profiles(id),
  summary TEXT NOT NULL,
  risk_level burnout_risk,
  interventions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_counsellor_reports_student ON counsellor_reports(student_id);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER journals_updated_at BEFORE UPDATE ON journals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE burnout_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_balance_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (students own their data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users manage own mood entries" ON mood_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own triggers" ON triggers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own journals" ON journals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own habits" ON habit_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own wellness scores" ON wellness_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own burnout scores" ON burnout_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own recommendations" ON recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own balance logs" ON study_balance_logs FOR ALL USING (auth.uid() = user_id);
