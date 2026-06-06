import { describe, it, expect } from "vitest";
import { buildCoachSystemPrompt } from "@/lib/coach/prompt-builder";

describe("prompt-builder", () => {
  it("returns base prompt without context", () => {
    const prompt = buildCoachSystemPrompt();
    expect(prompt).toContain("SweatJoy Coach");
    expect(prompt).toContain("NEET");
  });

  it("includes exam mode guidance for exam week", () => {
    const prompt = buildCoachSystemPrompt({
      exam_type: "NEET",
      exam_mode: "exam_week",
      days_until_exam: 5,
      mood_score: 4,
      anxiety_level: 8,
    });
    expect(prompt).toContain("Exam Week");
    expect(prompt).toContain("calmness");
    expect(prompt).toContain("Anxiety level: 8");
  });

  it("includes recent triggers in context", () => {
    const prompt = buildCoachSystemPrompt({
      recent_triggers: ["Exam Pressure", "Mock Test Results"],
    });
    expect(prompt).toContain("Exam Pressure");
  });
});
