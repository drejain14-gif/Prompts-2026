import { z } from "zod";

export const profileSetupSchema = z.object({
  full_name: z.string().min(2).max(100),
  age: z.number().int().min(10).max(35),
  gender: z.string().optional(),
  exam_type: z.enum(["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC", "SSC", "Board Exams"]),
  target_exam_date: z.string().date(),
  study_hours_per_day: z.number().min(1).max(16),
});

export const wellnessAssessmentSchema = z.object({
  stress_level: z.number().int().min(1).max(10),
  anxiety_level: z.number().int().min(1).max(10),
  sleep_quality: z.number().int().min(1).max(10),
  motivation_level: z.number().int().min(1).max(10),
  confidence_level: z.number().int().min(1).max(10),
});

export const moodEntrySchema = z.object({
  mood_score: z.number().int().min(1).max(10),
  emotion: z.enum(["happy", "calm", "motivated", "nervous", "stressed", "overwhelmed", "burned_out"]),
  sleep_quality: z.number().int().min(1).max(10),
  energy_level: z.number().int().min(1).max(10),
  anxiety_level: z.number().int().min(1).max(10),
  confidence_level: z.number().int().min(1).max(10),
  notes: z.string().max(500).optional(),
  entry_date: z.string().date().optional(),
});

export const triggerSchema = z.object({
  category: z.enum([
    "exam_pressure", "mock_test_results", "study_backlog", "social_media",
    "family_expectations", "relationships", "sleep_issues", "financial_concerns", "health_concerns",
  ]),
  custom_label: z.string().max(100).optional(),
  intensity: z.number().int().min(1).max(10).default(5),
  occurred_at: z.string().datetime().optional(),
});

export const journalSchema = z.object({
  prompt: z.string().min(1).max(200),
  content: z.string().max(5000),
  emoji_reflection: z.string().max(10).optional(),
  is_draft: z.boolean().default(false),
  entry_date: z.string().date().optional(),
});

export const habitLogSchema = z.object({
  habit_type: z.enum(["water", "exercise", "meditation", "sleep", "outdoor", "study"]),
  completed: z.boolean(),
  value: z.number().optional(),
  log_date: z.string().date().optional(),
});

export const studyBalanceSchema = z.object({
  study_hours: z.number().min(0).max(18),
  break_hours: z.number().min(0).max(8),
  sleep_hours: z.number().min(0).max(14),
  log_date: z.string().date().optional(),
});

export const coachMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.object({
    mood_score: z.number().optional(),
    recent_triggers: z.array(z.string()).optional(),
  }).optional(),
});

export const nlpSessionRecommendSchema = z.object({
  mood_score: z.number().min(1).max(10).optional(),
  emotion: z.enum(["happy", "calm", "motivated", "nervous", "stressed", "overwhelmed", "burned_out"]).optional(),
  anxiety_level: z.number().min(1).max(10).optional(),
  confidence_level: z.number().min(1).max(10).optional(),
  energy_level: z.number().min(1).max(10).optional(),
  wellness_goals: z.array(z.enum([
    "reduce_anxiety", "improve_sleep", "build_confidence",
    "manage_stress", "improve_focus", "emotional_balance",
  ])).optional(),
  recent_triggers: z.array(z.enum([
    "exam_pressure", "mock_test_results", "study_backlog", "social_media",
    "family_expectations", "relationships", "sleep_issues", "financial_concerns", "health_concerns",
  ])).optional(),
  completed_habits: z.array(z.enum(["water", "exercise", "meditation", "sleep", "outdoor", "study"])).optional(),
  missed_habits: z.array(z.enum(["water", "exercise", "meditation", "sleep", "outdoor", "study"])).optional(),
  recent_activity: z.enum(["study", "rest", "break"]).optional(),
});

export const nlpSessionCompleteSchema = z.object({
  session_id: z.string().min(1),
  session_title: z.string().min(1),
  technique: z.enum([
    "reframing", "anchoring", "visualization", "progressive_relaxation",
    "pattern_interrupt", "positive_affirmation", "grounding",
  ]),
  goals: z.array(z.enum([
    "reduce_anxiety", "improve_sleep", "build_confidence",
    "manage_stress", "improve_focus", "emotional_balance",
  ])),
  mood_snapshot: z.object({
    emotion: z.string().optional(),
    mood_score: z.number().optional(),
    anxiety_level: z.number().optional(),
  }).optional(),
  triggers_snapshot: z.array(z.string()).default([]),
  duration_seconds: z.number().int().min(0).optional(),
  reflection: z.string().max(500).optional(),
  xp_earned: z.number().int().min(0).default(0),
});
