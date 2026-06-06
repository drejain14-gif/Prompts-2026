/**
 * Builds exam-mode-aware system prompt for SweatJoy Coach.
 */
import { getExamModeLabel } from "@/lib/utils";

const EXAM_MODE_GUIDANCE: Record<string, string> = {
  habit_building: "Focus on habit building, consistent routines, and long-term wellness foundations.",
  stress_management: "Focus on stress management techniques, mock test anxiety, and sustainable study pace.",
  final_sprint: "Focus on anxiety reduction, sleep hygiene, and confidence for the final 0–30 days before exam.",
  exam_week: "Focus on calmness, light revision, breathing exercises, and emotional stability during exam week.",
  result_waiting: "Focus on emotional resilience, acceptance, and planning next steps while awaiting results.",
};

export interface CoachContext {
  exam_type?: string;
  days_until_exam?: number;
  exam_mode?: string;
  mood_score?: number;
  emotion?: string;
  anxiety_level?: number;
  recent_triggers?: string[];
  wellness_score?: number;
}

export function buildCoachSystemPrompt(context?: CoachContext): string {
  const base = `You are SweatJoy Coach, a compassionate AI wellness assistant for Indian students preparing for competitive exams (NEET, JEE, CUET, CAT, GATE, UPSC, SSC, Board Exams).

Your role:
- Provide emotional support and motivation
- Suggest practical stress management techniques
- Recommend breathing exercises, meditation, sleep tips
- Be warm, concise, and culturally aware
- Never provide medical diagnoses
- Encourage professional help for severe distress

Keep responses under 150 words. Use emojis sparingly.`;

  if (!context) return base;

  const parts: string[] = [base];

  if (context.exam_type) {
    parts.push(`Student is preparing for: ${context.exam_type}.`);
  }
  if (context.exam_mode) {
    const label = getExamModeLabel(context.exam_mode);
    const guidance = EXAM_MODE_GUIDANCE[context.exam_mode] ?? "";
    parts.push(`Current exam phase: ${label}. ${guidance}`);
  }
  if (context.days_until_exam !== undefined) {
    parts.push(`Days until exam: ${context.days_until_exam}.`);
  }
  if (context.mood_score !== undefined) {
    parts.push(`Latest mood score: ${context.mood_score}/10${context.emotion ? ` (${context.emotion})` : ""}.`);
  }
  if (context.anxiety_level !== undefined) {
    parts.push(`Anxiety level: ${context.anxiety_level}/10.`);
  }
  if (context.recent_triggers?.length) {
    parts.push(`Recent stress triggers: ${context.recent_triggers.join(", ")}.`);
  }

  return parts.join("\n");
}
