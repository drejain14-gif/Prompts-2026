export type UserRole = "student" | "parent" | "mentor" | "admin";

export type ExamType =
  | "NEET"
  | "JEE"
  | "CUET"
  | "CAT"
  | "GATE"
  | "UPSC"
  | "SSC"
  | "Board Exams";

export type Emotion =
  | "happy"
  | "calm"
  | "motivated"
  | "nervous"
  | "stressed"
  | "overwhelmed"
  | "burned_out";

export type TriggerCategory =
  | "exam_pressure"
  | "mock_test_results"
  | "study_backlog"
  | "social_media"
  | "family_expectations"
  | "relationships"
  | "sleep_issues"
  | "financial_concerns"
  | "health_concerns";

export type BurnoutRisk = "low" | "medium" | "high" | "critical";

export type HabitType =
  | "water"
  | "exercise"
  | "meditation"
  | "sleep"
  | "outdoor"
  | "study";

export interface Profile {
  id: string;
  full_name: string;
  age: number;
  gender?: string;
  exam_type: ExamType;
  target_exam_date: string;
  study_hours_per_day: number;
  role: UserRole;
  wellness_score?: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  emotion: Emotion;
  sleep_quality: number;
  energy_level: number;
  anxiety_level: number;
  confidence_level: number;
  notes?: string;
  entry_date: string;
  created_at: string;
}

export interface Trigger {
  id: string;
  user_id: string;
  category: TriggerCategory;
  custom_label?: string;
  intensity: number;
  occurred_at: string;
  created_at: string;
}

export interface Journal {
  id: string;
  user_id: string;
  prompt: string;
  content: string;
  emoji_reflection?: string;
  voice_url?: string;
  is_draft: boolean;
  sentiment_score?: number;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  user_id: string;
  habit_type: HabitType;
  completed: boolean;
  value?: number;
  log_date: string;
  created_at: string;
}

export interface WellnessScore {
  id: string;
  user_id: string;
  score: number;
  stress_level: number;
  anxiety_level: number;
  sleep_quality: number;
  motivation_level: number;
  confidence_level: number;
  assessed_at: string;
}

export interface BurnoutScore {
  id: string;
  user_id: string;
  score: number;
  risk_level: BurnoutRisk;
  factors: Record<string, number>;
  calculated_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  source: "ai" | "system";
  is_read: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_key: string;
  badge_name: string;
  xp_earned: number;
  earned_at: string;
}

export interface StudyBalanceLog {
  id: string;
  user_id: string;
  study_hours: number;
  break_hours: number;
  sleep_hours: number;
  log_date: string;
}

export type WellnessGoal =
  | "reduce_anxiety"
  | "improve_sleep"
  | "build_confidence"
  | "manage_stress"
  | "improve_focus"
  | "emotional_balance";

export type NlpTechnique =
  | "reframing"
  | "anchoring"
  | "visualization"
  | "progressive_relaxation"
  | "pattern_interrupt"
  | "positive_affirmation"
  | "grounding";

export interface NlpSessionLog {
  id: string;
  user_id: string;
  session_id: string;
  session_title: string;
  technique: NlpTechnique;
  goals: WellnessGoal[];
  mood_snapshot: {
    emotion?: Emotion;
    mood_score?: number;
    anxiety_level?: number;
  };
  triggers_snapshot: TriggerCategory[];
  completed: boolean;
  duration_seconds?: number;
  reflection?: string;
  xp_earned: number;
  started_at: string;
  completed_at?: string;
}

export interface VoiceCheckInLog {
  id: string;
  user_id: string;
  transcript_redacted: string;
  mood_score: number;
  voice_analysis: {
    averagePitchHz: number;
    pitchVariance: number;
    toneLabel: string;
    stressIndicator: number;
  };
  moderation_severity: "safe" | "abusive" | "threat_to_life";
  guardian_alert_sent: boolean;
  check_in_slot?: string;
  created_at: string;
}

export interface GuardianContact {
  id: string;
  student_id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  alert_on_abuse: boolean;
  alert_on_threat: boolean;
  opt_in_confirmed: boolean;
}

export interface GuardianAlert {
  id: string;
  student_id: string;
  guardian_id: string;
  severity: "abusive" | "threat_to_life";
  message_summary: string;
  acknowledged: boolean;
  created_at: string;
}

export interface ScheduledCheckInConfig {
  slot: "morning" | "afternoon" | "evening";
  hour: number;
  minute: number;
  label: string;
  sessionType: string;
  enabled: boolean;
}
