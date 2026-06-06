import { describe, it, expect } from "vitest";
import { awardXp, computeMoodStreak, XP_REWARDS } from "@/lib/gamification/award-engine";

describe("award-engine", () => {
  const baseState = {
    xp_points: 100,
    achievements: [],
    moodEntries: Array.from({ length: 7 }, (_, i) => ({
      id: `m-${i}`,
      user_id: "demo",
      mood_score: 7,
      emotion: "calm" as const,
      sleep_quality: 7,
      energy_level: 7,
      anxiety_level: 3,
      confidence_level: 7,
      entry_date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    })),
    journals: [],
    habitLogs: [],
  };

  it("awards correct XP for mood check-in", () => {
    const result = awardXp(baseState, "mood_checkin");
    expect(result.xpEarned).toBe(XP_REWARDS.mood_checkin);
    expect(result.totalXp).toBe(110);
  });

  it("awards 7-day streak badge", () => {
    const result = awardXp(baseState, "mood_checkin");
    expect(result.newBadges.some((b) => b.badge_key === "streak_7")).toBe(true);
  });

  it("computes mood streak correctly", () => {
    expect(computeMoodStreak(baseState.moodEntries)).toBe(7);
  });
});
