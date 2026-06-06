import { describe, it, expect } from "vitest";
import { moderateTranscript } from "@/lib/safety/content-moderator";

describe("content-moderator", () => {
  describe("moderateTranscript", () => {
    it("returns safe for neutral transcript", () => {
      const result = moderateTranscript("I feel a bit stressed about my mock test today.");
      expect(result.severity).toBe("safe");
      expect(result.isFlagged).toBe(false);
      expect(result.requiresGuardianAlert).toBe(false);
    });

    it("flags life-threatening statements", () => {
      const result = moderateTranscript("I want to end my life, nothing matters anymore.");
      expect(result.severity).toBe("threat_to_life");
      expect(result.isFlagged).toBe(true);
      expect(result.requiresGuardianAlert).toBe(true);
      expect(result.matchedTerms.length).toBeGreaterThan(0);
    });

    it("flags suicidal ideation variants", () => {
      expect(moderateTranscript("I've been thinking about suicide").severity).toBe("threat_to_life");
      expect(moderateTranscript("I want to kill myself").severity).toBe("threat_to_life");
      expect(moderateTranscript("I don't want to live anymore").severity).toBe("threat_to_life");
    });

    it("flags abusive self-talk", () => {
      const result = moderateTranscript("I hate myself, I am worthless and a failure.");
      expect(result.severity).toBe("abusive");
      expect(result.requiresGuardianAlert).toBe(true);
    });

    it("redacts matched terms in sanitized output", () => {
      const result = moderateTranscript("I want to kill myself today");
      expect(result.sanitizedTranscript).toContain("[REDACTED]");
      expect(result.sanitizedTranscript).not.toContain("kill myself");
    });

    it("handles empty transcript", () => {
      const result = moderateTranscript("");
      expect(result.severity).toBe("safe");
      expect(result.sanitizedTranscript).toBe("");
    });
  });
});

describe("content-moderator regression", () => {
  it("does not false-positive on normal exam stress language", () => {
    const phrases = [
      "I'm nervous about NEET but studying hard",
      "Mock test went badly, need to improve",
      "Feeling overwhelmed with the syllabus",
    ];
    for (const phrase of phrases) {
      expect(moderateTranscript(phrase).severity).toBe("safe");
    }
  });

  it("consistently flags crisis phrases across casing", () => {
    expect(moderateTranscript("SUICIDE").severity).toBe("threat_to_life");
    expect(moderateTranscript("Self-Harm thoughts").severity).toBe("threat_to_life");
  });
});
