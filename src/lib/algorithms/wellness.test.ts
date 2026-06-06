import { describe, it, expect } from "vitest";
import { calculateWellnessScore, calculateBalanceScore } from "@/lib/algorithms/wellness";

describe("wellness algorithms", () => {
  describe("calculateWellnessScore", () => {
    it("returns high score for positive assessment", () => {
      const score = calculateWellnessScore({
        stress_level: 2,
        anxiety_level: 2,
        sleep_quality: 9,
        motivation_level: 8,
        confidence_level: 8,
      });
      expect(score).toBeGreaterThan(7.5);
    });

    it("returns low score for poor assessment", () => {
      const score = calculateWellnessScore({
        stress_level: 9,
        anxiety_level: 9,
        sleep_quality: 3,
        motivation_level: 3,
        confidence_level: 3,
      });
      expect(score).toBeLessThan(4);
    });
  });

  describe("calculateBalanceScore", () => {
    it("returns high score for ideal balance", () => {
      expect(calculateBalanceScore(8, 2, 8)).toBeGreaterThan(90);
    });

    it("penalizes excessive study hours", () => {
      const ideal = calculateBalanceScore(8, 2, 8);
      const overload = calculateBalanceScore(14, 1, 5);
      expect(overload).toBeLessThan(ideal);
    });

    it("penalizes insufficient sleep", () => {
      const good = calculateBalanceScore(8, 2, 8);
      const poorSleep = calculateBalanceScore(8, 2, 4);
      expect(poorSleep).toBeLessThan(good);
    });
  });
});
