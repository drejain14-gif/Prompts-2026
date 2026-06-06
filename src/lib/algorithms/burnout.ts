import type { BurnoutRisk } from "@/lib/types/database";

export interface BurnoutInput {
  moodTrend: number[]; // last 7 days mood scores
  anxietyTrend: number[];
  sleepQuality: number;
  confidenceScore: number;
  studyHours: number;
  triggerFrequency: number; // triggers in last 7 days
}

export interface BurnoutResult {
  score: number;
  riskLevel: BurnoutRisk;
  factors: Record<string, number>;
  recommendations: string[];
}

export function calculateBurnoutScore(input: BurnoutInput): BurnoutResult {
  const avgMood =
    input.moodTrend.length > 0
      ? input.moodTrend.reduce((a, b) => a + b, 0) / input.moodTrend.length
      : 5;
  const avgAnxiety =
    input.anxietyTrend.length > 0
      ? input.anxietyTrend.reduce((a, b) => a + b, 0) / input.anxietyTrend.length
      : 5;

  const moodDecline =
    input.moodTrend.length >= 2
      ? input.moodTrend[0] - input.moodTrend[input.moodTrend.length - 1]
      : 0;

  const factors: Record<string, number> = {
    mood: Math.max(0, (10 - avgMood) * 10),
    anxiety: avgAnxiety * 10,
    sleep: Math.max(0, (10 - input.sleepQuality) * 10),
    confidence: Math.max(0, (10 - input.confidenceScore) * 10),
    studyOverload: Math.min(100, Math.max(0, (input.studyHours - 8) * 15)),
    triggers: Math.min(100, input.triggerFrequency * 12),
    moodDecline: Math.max(0, moodDecline * 15),
  };

  const weights = {
    mood: 0.2,
    anxiety: 0.2,
    sleep: 0.15,
    confidence: 0.1,
    studyOverload: 0.15,
    triggers: 0.1,
    moodDecline: 0.1,
  };

  const score = Object.entries(factors).reduce(
    (total, [key, value]) =>
      total + value * weights[key as keyof typeof weights],
    0
  );

  let riskLevel: BurnoutRisk = "low";
  if (score >= 75) riskLevel = "critical";
  else if (score >= 55) riskLevel = "high";
  else if (score >= 35) riskLevel = "medium";

  const recommendations = getBurnoutRecommendations(riskLevel, factors);

  return {
    score: Math.round(score * 100) / 100,
    riskLevel,
    factors,
    recommendations,
  };
}

function getBurnoutRecommendations(
  risk: BurnoutRisk,
  factors: Record<string, number>
): string[] {
  const recs: string[] = [];

  if (risk === "critical") {
    recs.push("Consider speaking with a counsellor immediately.");
    recs.push("Take a full rest day — your wellbeing comes first.");
  }

  if (factors.sleep > 50) {
    recs.push("Prioritize 7–8 hours of sleep tonight.");
  }
  if (factors.studyOverload > 50) {
    recs.push("Reduce study hours by 1–2 hours and add breaks.");
  }
  if (factors.anxiety > 60) {
    recs.push("Try a 5-minute box breathing exercise.");
  }
  if (factors.moodDecline > 40) {
    recs.push("Your mood has been declining — journal about what's changed.");
  }
  if (recs.length === 0) {
    recs.push("Keep up your wellness routine — you're doing well!");
  }

  return recs;
}

export function predictMoodDecline(moodHistory: number[]): {
  willDecline: boolean;
  confidence: number;
} {
  if (moodHistory.length < 3) {
    return { willDecline: false, confidence: 0 };
  }

  const recent = moodHistory.slice(0, 3);
  const declining = recent.every(
    (val, i) => i === 0 || val <= recent[i - 1]
  );
  const avgDrop = recent[0] - recent[recent.length - 1];

  return {
    willDecline: declining && avgDrop >= 1.5,
    confidence: Math.min(0.95, avgDrop / 5),
  };
}
