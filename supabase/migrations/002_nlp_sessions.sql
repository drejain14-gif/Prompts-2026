-- NLP Sessions table
CREATE TYPE wellness_goal AS ENUM (
  'reduce_anxiety', 'improve_sleep', 'build_confidence',
  'manage_stress', 'improve_focus', 'emotional_balance'
);

CREATE TYPE nlp_technique AS ENUM (
  'reframing', 'anchoring', 'visualization', 'progressive_relaxation',
  'pattern_interrupt', 'positive_affirmation', 'grounding'
);

CREATE TABLE nlp_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  session_title TEXT NOT NULL,
  technique nlp_technique NOT NULL,
  goals wellness_goal[] NOT NULL DEFAULT '{}',
  mood_snapshot JSONB DEFAULT '{}',
  triggers_snapshot TEXT[] DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  duration_seconds INTEGER,
  reflection TEXT,
  xp_earned INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_nlp_sessions_user ON nlp_sessions(user_id, started_at DESC);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wellness_goals wellness_goal[] DEFAULT '{}';

ALTER TABLE nlp_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own nlp sessions" ON nlp_sessions FOR ALL USING (auth.uid() = user_id);
