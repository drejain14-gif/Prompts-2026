-- Voice check-ins, guardian alerts, scheduled notifications

CREATE TYPE moderation_severity AS ENUM ('safe', 'abusive', 'threat_to_life');

CREATE TABLE voice_check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transcript_redacted TEXT NOT NULL DEFAULT '',
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
  voice_analysis JSONB NOT NULL DEFAULT '{}',
  moderation_severity moderation_severity NOT NULL DEFAULT 'safe',
  guardian_alert_sent BOOLEAN DEFAULT FALSE,
  check_in_slot TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_voice_check_ins_user ON voice_check_ins(user_id, created_at DESC);

CREATE TABLE guardian_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  relationship TEXT NOT NULL,
  alert_on_abuse BOOLEAN DEFAULT TRUE,
  alert_on_threat BOOLEAN DEFAULT TRUE,
  opt_in_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guardian_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES guardian_contacts(id),
  severity moderation_severity NOT NULL,
  message_summary TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guardian_alerts_student ON guardian_alerts(student_id, created_at DESC);

CREATE TABLE check_in_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slot TEXT NOT NULL,
  hour INTEGER CHECK (hour BETWEEN 0 AND 23),
  minute INTEGER CHECK (minute BETWEEN 0 AND 59),
  label TEXT NOT NULL,
  session_type TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, slot)
);

ALTER TABLE voice_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own voice check-ins" ON voice_check_ins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Students manage guardian contacts" ON guardian_contacts FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Guardians view alerts" ON guardian_alerts FOR SELECT USING (
  auth.uid() IN (SELECT student_id FROM guardian_contacts WHERE id = guardian_id)
);
CREATE POLICY "Users manage own schedule" ON check_in_schedules FOR ALL USING (auth.uid() = user_id);
