import { describe, it, expect } from "vitest";
import { moderateTranscript } from "@/lib/safety/content-moderator";
import { buildCoachSystemPrompt } from "@/lib/coach/prompt-builder";

describe("voice-checkin API logic", () => {
  it("flags threat and requires guardian alert", () => {
    const result = moderateTranscript("I want to end my life");
    expect(result.requiresGuardianAlert).toBe(true);
    expect(result.severity).toBe("threat_to_life");
  });

  it("returns safe for normal wellness speech", () => {
    const result = moderateTranscript("I feel stressed about NEET but I studied well today");
    expect(result.severity).toBe("safe");
    expect(result.requiresGuardianAlert).toBe(false);
  });
});

describe("coach API context integration", () => {
  it("builds exam-aware prompt for NEET student", () => {
    const prompt = buildCoachSystemPrompt({
      exam_type: "NEET",
      exam_mode: "final_sprint",
      mood_score: 5,
    });
    expect(prompt).toContain("NEET");
    expect(prompt).toContain("Final Sprint");
  });
});
