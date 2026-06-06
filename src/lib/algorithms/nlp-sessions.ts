import type { Emotion, HabitType, TriggerCategory } from "@/lib/types/database";
import { TRIGGER_LABELS } from "@/lib/algorithms/wellness";

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

export interface NlpSessionStep {
  order: number;
  title: string;
  instruction: string;
  duration_seconds: number;
  prompt?: string;
}

export interface NlpSessionTemplate {
  id: string;
  title: string;
  description: string;
  technique: NlpTechnique;
  duration_minutes: number;
  goals: WellnessGoal[];
  emotions: Emotion[];
  triggers: TriggerCategory[];
  activities: ("study" | "rest" | "habit_gap" | "post_meditation")[];
  steps: NlpSessionStep[];
  xp_reward: number;
}

export interface SessionContext {
  mood_score?: number;
  emotion?: Emotion;
  anxiety_level?: number;
  confidence_level?: number;
  energy_level?: number;
  wellness_goals?: WellnessGoal[];
  recent_triggers?: TriggerCategory[];
  completed_habits?: HabitType[];
  missed_habits?: HabitType[];
  recent_activity?: "study" | "rest" | "break";
}

export interface RecommendedSession extends NlpSessionTemplate {
  match_score: number;
  match_reasons: string[];
}

export const WELLNESS_GOAL_LABELS: Record<WellnessGoal, string> = {
  reduce_anxiety: "Reduce Anxiety",
  improve_sleep: "Improve Sleep",
  build_confidence: "Build Confidence",
  manage_stress: "Manage Stress",
  improve_focus: "Improve Focus",
  emotional_balance: "Emotional Balance",
};

export const NLP_SESSIONS: NlpSessionTemplate[] = [
  {
    id: "calm-exam-reframe",
    title: "Exam Pressure Reframe",
    description: "Transform exam anxiety into focused energy using cognitive reframing.",
    technique: "reframing",
    duration_minutes: 8,
    goals: ["reduce_anxiety", "manage_stress", "improve_focus"],
    emotions: ["nervous", "stressed", "overwhelmed"],
    triggers: ["exam_pressure", "mock_test_results"],
    activities: ["study"],
    xp_reward: 25,
    steps: [
      { order: 1, title: "Acknowledge", instruction: "Notice where you feel tension in your body. Name the feeling without judgment.", duration_seconds: 60 },
      { order: 2, title: "Identify the Thought", instruction: "What thought is driving this anxiety? Write it mentally: 'I will fail' or 'There's too much to study'.", duration_seconds: 90, prompt: "What specific thought is causing pressure right now?" },
      { order: 3, title: "Reframe", instruction: "Replace it with: 'I am preparing step by step. Each mock test teaches me something valuable.'", duration_seconds: 120 },
      { order: 4, title: "Anchor Calm", instruction: "Press thumb and forefinger together. Breathe in for 4, out for 6. This is your calm anchor.", duration_seconds: 90 },
      { order: 5, title: "Future Pace", instruction: "Visualize yourself walking into the exam room feeling prepared and calm. See yourself answering confidently.", duration_seconds: 120 },
    ],
  },
  {
    id: "mock-test-recovery",
    title: "Mock Test Recovery",
    description: "Reframe disappointing results and rebuild confidence after a tough mock test.",
    technique: "reframing",
    duration_minutes: 10,
    goals: ["build_confidence", "emotional_balance", "manage_stress"],
    emotions: ["stressed", "overwhelmed", "nervous", "burned_out"],
    triggers: ["mock_test_results", "study_backlog"],
    activities: ["study", "rest"],
    xp_reward: 30,
    steps: [
      { order: 1, title: "Release", instruction: "Take 3 deep breaths. With each exhale, release the weight of today's score.", duration_seconds: 60 },
      { order: 2, title: "Separate Score from Self", instruction: "Say: 'My mock score is data, not my identity. I am more than one number.'", duration_seconds: 90 },
      { order: 3, title: "Extract Lessons", instruction: "Identify 2 topics the mock revealed — these are gifts, not failures.", duration_seconds: 120, prompt: "What 2 topics need more attention?" },
      { order: 4, title: "Confidence Anchor", instruction: "Recall a moment you solved a hard problem. Feel that success in your body now.", duration_seconds: 90 },
      { order: 5, title: "Action Step", instruction: "Choose ONE small action for tomorrow. One chapter, one formula set, one revision block.", duration_seconds: 120 },
    ],
  },
  {
    id: "sleep-reset",
    title: "Sleep Reset Ritual",
    description: "Progressive relaxation and NLP anchoring for better pre-exam sleep.",
    technique: "progressive_relaxation",
    duration_minutes: 12,
    goals: ["improve_sleep", "reduce_anxiety", "emotional_balance"],
    emotions: ["stressed", "nervous", "overwhelmed", "burned_out"],
    triggers: ["sleep_issues", "exam_pressure"],
    activities: ["rest"],
    xp_reward: 25,
    steps: [
      { order: 1, title: "Screen Off", instruction: "Put devices away. Dim the lights. Your brain needs a clear signal that rest is coming.", duration_seconds: 30 },
      { order: 2, title: "Body Scan", instruction: "Starting from toes, tense each muscle group for 5 seconds, then release. Move up to your head.", duration_seconds: 180 },
      { order: 3, title: "Breath Anchor", instruction: "4-7-8 breathing: inhale 4, hold 7, exhale 8. Repeat 4 cycles.", duration_seconds: 120 },
      { order: 4, title: "Sleep Visualization", instruction: "Picture a safe, calm place. You are resting deeply. Tomorrow's study will be easier with good sleep.", duration_seconds: 120 },
      { order: 5, title: "Affirmation", instruction: "Repeat: 'My mind rests. My body heals. I wake refreshed and ready.'", duration_seconds: 60 },
    ],
  },
  {
    id: "confidence-builder",
    title: "Confidence Builder",
    description: "Stack positive evidence and anchor peak confidence states for exam day.",
    technique: "anchoring",
    duration_minutes: 7,
    goals: ["build_confidence", "improve_focus"],
    emotions: ["nervous", "stressed", "calm", "motivated"],
    triggers: ["family_expectations", "exam_pressure"],
    activities: ["study", "post_meditation"],
    xp_reward: 20,
    steps: [
      { order: 1, title: "Peak Memory", instruction: "Recall your best study session — when everything clicked. See it vividly.", duration_seconds: 90 },
      { order: 2, title: "Amplify", instruction: "Make the image brighter, sounds louder, feelings stronger. You ARE capable.", duration_seconds: 60 },
      { order: 3, title: "Set Anchor", instruction: "At peak feeling, press thumb and middle finger together. This is your confidence anchor.", duration_seconds: 60 },
      { order: 4, title: "Evidence Stack", instruction: "List 3 things you've learned this week. Each one is proof of progress.", duration_seconds: 120, prompt: "Name 3 things you learned recently" },
      { order: 5, title: "Test Anchor", instruction: "Trigger your anchor now. Feel confidence return instantly. Use this before mock tests.", duration_seconds: 60 },
    ],
  },
  {
    id: "backlog-breakthrough",
    title: "Study Backlog Breakthrough",
    description: "Pattern interrupt and chunking to overcome overwhelm from study backlog.",
    technique: "pattern_interrupt",
    duration_minutes: 6,
    goals: ["manage_stress", "improve_focus"],
    emotions: ["overwhelmed", "stressed", "burned_out"],
    triggers: ["study_backlog"],
    activities: ["study", "habit_gap"],
    xp_reward: 20,
    steps: [
      { order: 1, title: "Stop the Spiral", instruction: "Stand up. Shake your hands. Say 'STOP' out loud. Break the overwhelm loop.", duration_seconds: 30 },
      { order: 2, title: "Chunk It", instruction: "The backlog feels huge because it's one blob. Split it: Physics → 3 chapters. Chemistry → 2 units.", duration_seconds: 90, prompt: "What's the smallest unit you can tackle?" },
      { order: 3, title: "2-Minute Start", instruction: "Commit to just 2 minutes on the smallest chunk. Momentum beats motivation.", duration_seconds: 120 },
      { order: 4, title: "Reframe Overwhelm", instruction: "'I have too much' becomes 'I have a clear list and I start with one item.'", duration_seconds: 60 },
    ],
  },
  {
    id: "social-media-detox",
    title: "Focus Reset",
    description: "Break social media distraction loops and restore study focus.",
    technique: "pattern_interrupt",
    duration_minutes: 5,
    goals: ["improve_focus", "manage_stress"],
    emotions: ["stressed", "nervous", "overwhelmed"],
    triggers: ["social_media"],
    activities: ["study", "rest"],
    xp_reward: 15,
    steps: [
      { order: 1, title: "Awareness", instruction: "Notice: what were you scrolling for? Boredom? Escape? Comparison?", duration_seconds: 45, prompt: "What triggered the scroll?" },
      { order: 2, title: "Interrupt", instruction: "Close the app. Place phone face-down, out of reach. Physical distance creates mental distance.", duration_seconds: 30 },
      { order: 3, title: "Intention Set", instruction: "State your next study goal aloud: 'For the next 25 minutes, I focus on [topic].'", duration_seconds: 45 },
      { order: 4, title: "Focus Anchor", instruction: "3 deep breaths. On the third exhale, begin. Your attention is a muscle — you're training it now.", duration_seconds: 60 },
    ],
  },
  {
    id: "motivation-boost",
    title: "Motivation Boost",
    description: "Visualization and affirmation to reignite drive when energy is low.",
    technique: "visualization",
    duration_minutes: 6,
    goals: ["build_confidence", "improve_focus", "emotional_balance"],
    emotions: ["happy", "calm", "motivated"],
    triggers: [],
    activities: ["rest", "habit_gap"],
    xp_reward: 15,
    steps: [
      { order: 1, title: "Gratitude Pause", instruction: "Name 3 things going well in your prep journey, however small.", duration_seconds: 60, prompt: "What 3 things are going well?" },
      { order: 2, title: "Future Self", instruction: "See yourself after the exam — proud, relieved, knowing you gave your best.", duration_seconds: 90 },
      { order: 3, title: "Why Anchor", instruction: "Remember WHY you started. Your dream college, your family's hope, your own ambition.", duration_seconds: 90 },
      { order: 4, title: "Micro Action", instruction: "Choose one 10-minute task to do right now. Small wins create big momentum.", duration_seconds: 60 },
    ],
  },
  {
    id: "burnout-recovery",
    title: "Burnout Recovery",
    description: "Gentle grounding and self-compassion when you're running on empty.",
    technique: "grounding",
    duration_minutes: 10,
    goals: ["emotional_balance", "manage_stress", "reduce_anxiety"],
    emotions: ["burned_out", "overwhelmed", "stressed"],
    triggers: ["exam_pressure", "study_backlog", "sleep_issues"],
    activities: ["rest", "habit_gap"],
    xp_reward: 30,
    steps: [
      { order: 1, title: "Permission to Rest", instruction: "Say: 'Rest is part of preparation, not a failure.' Your brain consolidates memory during rest.", duration_seconds: 60 },
      { order: 2, title: "5-4-3-2-1 Grounding", instruction: "Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.", duration_seconds: 120 },
      { order: 3, title: "Body Compassion", instruction: "Place hand on heart. Feel it beating. Thank your body for carrying you through hard days.", duration_seconds: 90 },
      { order: 4, title: "Minimum Viable Day", instruction: "Today doesn't need 10 hours. What is the ONE kind thing you can do for yourself?", duration_seconds: 90, prompt: "One kind thing for today?" },
      { order: 5, title: "Recovery Plan", instruction: "Plan: sleep by X time, one walk, no guilt. Tomorrow is a fresh start.", duration_seconds: 60 },
    ],
  },
];

export function recommendNlpSessions(context: SessionContext, limit = 4): RecommendedSession[] {
  const goals = context.wellness_goals ?? inferGoals(context);
  const triggers = context.recent_triggers ?? [];
  const emotion = context.emotion;
  const activity = inferActivity(context);

  const scored = NLP_SESSIONS.map((session) => {
    let score = 0;
    const reasons: string[] = [];

    if (emotion && session.emotions.includes(emotion)) {
      score += 30;
      reasons.push(`Matches your ${emotion.replace("_", " ")} mood`);
    }

    const goalOverlap = session.goals.filter((g) => goals.includes(g)).length;
    if (goalOverlap > 0) {
      score += goalOverlap * 15;
      reasons.push(`Supports your ${WELLNESS_GOAL_LABELS[session.goals.find((g) => goals.includes(g))!]} goal`);
    }

    const triggerOverlap = session.triggers.filter((t) => triggers.includes(t)).length;
    if (triggerOverlap > 0) {
      score += triggerOverlap * 20;
      const matched = session.triggers.find((t) => triggers.includes(t))!;
      reasons.push(`Addresses ${TRIGGER_LABELS[matched]} trigger`);
    }

    if (activity && session.activities.includes(activity)) {
      score += 15;
      reasons.push(`Fits your current activity pattern`);
    }

    if (context.anxiety_level && context.anxiety_level >= 7 && session.goals.includes("reduce_anxiety")) {
      score += 20;
      reasons.push("High anxiety detected — calming session recommended");
    }

    if (context.mood_score && context.mood_score <= 4 && session.technique === "grounding") {
      score += 15;
      reasons.push("Low mood — grounding session recommended");
    }

    if (context.missed_habits && context.missed_habits.length >= 3 && session.activities.includes("habit_gap")) {
      score += 10;
      reasons.push("Helps restart after missed habits");
    }

    return { ...session, match_score: score, match_reasons: reasons.slice(0, 3) };
  });

  return scored
    .filter((s) => s.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, limit);
}

function inferGoals(context: SessionContext): WellnessGoal[] {
  const goals: WellnessGoal[] = [];

  if (context.anxiety_level && context.anxiety_level >= 6) goals.push("reduce_anxiety");
  if (context.emotion === "nervous" || context.emotion === "stressed") goals.push("manage_stress");
  if (context.emotion === "overwhelmed" || context.emotion === "burned_out") goals.push("emotional_balance");
  if (context.confidence_level && context.confidence_level <= 5) goals.push("build_confidence");
  if (context.recent_triggers?.includes("sleep_issues")) goals.push("improve_sleep");
  if (context.recent_activity === "study") goals.push("improve_focus");

  return goals.length > 0 ? goals : ["emotional_balance", "manage_stress"];
}

function inferActivity(context: SessionContext): NlpSessionTemplate["activities"][number] | undefined {
  if (context.recent_activity === "study") return "study";
  if (context.recent_activity === "rest") return "rest";
  if (context.completed_habits?.includes("meditation")) return "post_meditation";
  if (context.missed_habits && context.missed_habits.length >= 2) return "habit_gap";
  return undefined;
}

export function buildContextFromDemoData(data: {
  moodEntries: { mood_score: number; emotion: Emotion; anxiety_level: number; confidence_level: number; energy_level: number }[];
  triggers: { category: TriggerCategory }[];
  habitLogs: { habit_type: HabitType; completed: boolean; log_date: string }[];
  wellness_goals?: WellnessGoal[];
}): SessionContext {
  const today = new Date().toISOString().split("T")[0];
  const latestMood = data.moodEntries[0];
  const recentTriggers = data.triggers.slice(0, 5).map((t) => t.category);
  const todayHabits = data.habitLogs.filter((h) => h.log_date === today);
  const allHabitTypes: HabitType[] = ["water", "exercise", "meditation", "sleep", "outdoor", "study"];
  const completed = todayHabits.filter((h) => h.completed).map((h) => h.habit_type);
  const missed = allHabitTypes.filter((t) => !completed.includes(t));

  return {
    mood_score: latestMood?.mood_score,
    emotion: latestMood?.emotion,
    anxiety_level: latestMood?.anxiety_level,
    confidence_level: latestMood?.confidence_level,
    energy_level: latestMood?.energy_level,
    wellness_goals: data.wellness_goals,
    recent_triggers: recentTriggers,
    completed_habits: completed,
    missed_habits: missed,
    recent_activity: completed.includes("study") ? "study" : "rest",
  };
}
