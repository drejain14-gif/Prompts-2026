export interface WellnessAssessmentInput {
  stress_level: number;
  anxiety_level: number;
  sleep_quality: number;
  motivation_level: number;
  confidence_level: number;
}

export function calculateWellnessScore(input: WellnessAssessmentInput): number {
  const invertedStress = 11 - input.stress_level;
  const invertedAnxiety = 11 - input.anxiety_level;

  const score =
    invertedStress * 0.25 +
    invertedAnxiety * 0.25 +
    input.sleep_quality * 0.2 +
    input.motivation_level * 0.15 +
    input.confidence_level * 0.15;

  return Math.round((score / 10) * 100) / 10;
}

export function calculateBalanceScore(
  studyHours: number,
  breakHours: number,
  sleepHours: number
): number {
  const idealStudy = 8;
  const idealBreak = 2;
  const idealSleep = 8;

  const studyScore = Math.max(0, 100 - Math.abs(studyHours - idealStudy) * 12);
  const breakScore = Math.max(0, 100 - Math.abs(breakHours - idealBreak) * 20);
  const sleepScore = Math.max(0, 100 - Math.abs(sleepHours - idealSleep) * 15);

  return Math.round((studyScore * 0.4 + breakScore * 0.25 + sleepScore * 0.35) * 10) / 10;
}

export const JOURNAL_PROMPTS = [
  "What went well today?",
  "What challenged you today?",
  "What are you worried about?",
  "What can you improve tomorrow?",
  "What are you grateful for today?",
  "What did you learn about yourself today?",
];

export const BADGES = [
  { key: "streak_7", name: "7 Day Streak", xp: 100, description: "7 consecutive check-ins" },
  { key: "streak_30", name: "30 Day Streak", xp: 500, description: "30 consecutive check-ins" },
  { key: "reflection_master", name: "Reflection Master", xp: 200, description: "10 journal entries" },
  { key: "calm_mind", name: "Calm Mind", xp: 150, description: "7 days with low anxiety" },
  { key: "consistency_champion", name: "Consistency Champion", xp: 300, description: "All habits completed for a week" },
] as const;

export const TRIGGER_LABELS: Record<string, string> = {
  exam_pressure: "Exam Pressure",
  mock_test_results: "Mock Test Results",
  study_backlog: "Study Backlog",
  social_media: "Social Media",
  family_expectations: "Family Expectations",
  relationships: "Relationships",
  sleep_issues: "Sleep Issues",
  financial_concerns: "Financial Concerns",
  health_concerns: "Health Concerns",
};

export const EMOTION_CONFIG: Record<
  string,
  { label: string; emoji: string; color: string }
> = {
  happy: { label: "Happy", emoji: "😊", color: "bg-yellow-100 text-yellow-800" },
  calm: { label: "Calm", emoji: "😌", color: "bg-teal-100 text-teal-800" },
  motivated: { label: "Motivated", emoji: "💪", color: "bg-green-100 text-green-800" },
  nervous: { label: "Nervous", emoji: "😰", color: "bg-orange-100 text-orange-800" },
  stressed: { label: "Stressed", emoji: "😣", color: "bg-red-100 text-red-800" },
  overwhelmed: { label: "Overwhelmed", emoji: "😵", color: "bg-purple-100 text-purple-800" },
  burned_out: { label: "Burned Out", emoji: "🔥", color: "bg-gray-100 text-gray-800" },
};
