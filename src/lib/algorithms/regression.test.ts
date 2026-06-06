import { describe, it, expect } from "vitest";
import { calculateBurnoutScore } from "@/lib/algorithms/burnout";
import { calculateWellnessScore } from "@/lib/algorithms/wellness";
import { recommendNlpSessions, buildContextFromDemoData } from "@/lib/algorithms/nlp-sessions";

describe("burnout engine regression", () => {
  it("returns low risk for healthy metrics", () => {
    const result = calculateBurnoutScore({
      moodTrend: [8, 8, 7, 8],
      anxietyTrend: [3, 3, 4, 3],
      sleepQuality: 8,
      confidenceScore: 8,
      studyHours: 7,
      triggerFrequency: 1,
    });
    expect(result.riskLevel).toBe("low");
    expect(result.score).toBeLessThan(35);
  });

  it("returns critical risk for severe decline", () => {
    const result = calculateBurnoutScore({
      moodTrend: [8, 5, 3, 2],
      anxietyTrend: [5, 7, 9, 10],
      sleepQuality: 3,
      confidenceScore: 2,
      studyHours: 14,
      triggerFrequency: 8,
    });
    expect(["high", "critical"]).toContain(result.riskLevel);
  });
});

describe("wellness score regression", () => {
  it("calculates high score for good assessment", () => {
    const score = calculateWellnessScore({
      stress_level: 2,
      anxiety_level: 2,
      sleep_quality: 9,
      motivation_level: 8,
      confidence_level: 8,
    });
    expect(score).toBeGreaterThan(7);
  });
});

describe("NLP session recommendation regression", () => {
  it("recommends exam reframe for exam pressure trigger", () => {
    const context = buildContextFromDemoData({
      moodEntries: [{
        mood_score: 5,
        emotion: "stressed",
        anxiety_level: 7,
        confidence_level: 5,
        energy_level: 5,
      }],
      triggers: [{ category: "exam_pressure" }],
      habitLogs: [],
    });
    const recs = recommendNlpSessions(context, 3);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.some((r) => r.id === "calm-exam-reframe")).toBe(true);
  });

  it("recommends burnout recovery for burned_out emotion", () => {
    const context = buildContextFromDemoData({
      moodEntries: [{
        mood_score: 2,
        emotion: "burned_out",
        anxiety_level: 9,
        confidence_level: 3,
        energy_level: 2,
      }],
      triggers: [{ category: "study_backlog" }],
      habitLogs: [],
    });
    const recs = recommendNlpSessions(context, 5);
    expect(recs.some((r) => r.id === "burnout-recovery")).toBe(true);
  });
});

describe("problem statement alignment", () => {
  it("supports NEET/JEE student wellness use case via exam triggers", () => {
    const context = buildContextFromDemoData({
      moodEntries: [{ mood_score: 4, emotion: "nervous", anxiety_level: 8, confidence_level: 4, energy_level: 5 }],
      triggers: [{ category: "mock_test_results" }],
      habitLogs: [],
      wellness_goals: ["reduce_anxiety"],
    });
    const recs = recommendNlpSessions(context);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].match_score).toBeGreaterThan(0);
  });
});
