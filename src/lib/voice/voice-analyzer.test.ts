import { describe, it, expect } from "vitest";
import {
  analyzeVoiceSamples,
  toneToMoodScore,
  MIN_PITCH_SAMPLES,
  type PitchSample,
} from "@/lib/voice/voice-analyzer";

describe("voice-analyzer", () => {
  describe("analyzeVoiceSamples", () => {
    it("returns low confidence with insufficient samples", () => {
      const result = analyzeVoiceSamples([{ frequencyHz: 180, volume: 0.3 }]);
      expect(result.confidenceScore).toBeLessThan(0.5);
      expect(result.toneLabel).toBe("neutral");
    });

    it("detects calm tone from stable low-variance pitch", () => {
      const samples: PitchSample[] = Array.from({ length: 10 }, () => ({
        frequencyHz: 160,
        volume: 0.25,
      }));
      const result = analyzeVoiceSamples(samples);
      expect(result.toneLabel).toBe("calm");
      expect(result.stressIndicator).toBeLessThan(0.4);
    });

    it("detects distressed tone from high pitch variance", () => {
      const samples: PitchSample[] = [
        { frequencyHz: 280, volume: 0.7 },
        { frequencyHz: 150, volume: 0.6 },
        { frequencyHz: 300, volume: 0.8 },
        { frequencyHz: 140, volume: 0.5 },
        { frequencyHz: 290, volume: 0.75 },
        { frequencyHz: 160, volume: 0.65 },
      ];
      const result = analyzeVoiceSamples(samples);
      expect(["tense", "distressed", "energetic"]).toContain(result.toneLabel);
      expect(result.stressIndicator).toBeGreaterThan(0.2);
    });

    it("requires minimum sample count constant", () => {
      expect(MIN_PITCH_SAMPLES).toBe(5);
    });
  });

  describe("toneToMoodScore", () => {
    it("maps calm tone to high mood score", () => {
      const score = toneToMoodScore({
        averagePitchHz: 160,
        pitchVariance: 50,
        averageVolume: 0.3,
        toneLabel: "calm",
        stressIndicator: 0.1,
        confidenceScore: 0.9,
      });
      expect(score).toBeGreaterThanOrEqual(6);
    });

    it("maps distressed tone to low mood score", () => {
      const score = toneToMoodScore({
        averagePitchHz: 280,
        pitchVariance: 600,
        averageVolume: 0.7,
        toneLabel: "distressed",
        stressIndicator: 0.8,
        confidenceScore: 0.9,
      });
      expect(score).toBeLessThanOrEqual(3);
    });

    it("clamps mood score between 1 and 10", () => {
      const low = toneToMoodScore({
        averagePitchHz: 300,
        pitchVariance: 800,
        averageVolume: 0.9,
        toneLabel: "distressed",
        stressIndicator: 1,
        confidenceScore: 0.9,
      });
      expect(low).toBeGreaterThanOrEqual(1);

      const high = toneToMoodScore({
        averagePitchHz: 150,
        pitchVariance: 30,
        averageVolume: 0.2,
        toneLabel: "calm",
        stressIndicator: 0,
        confidenceScore: 0.9,
      });
      expect(high).toBeLessThanOrEqual(10);
    });
  });
});

describe("voice-analyzer regression", () => {
  it("produces consistent results for identical input", () => {
    const samples: PitchSample[] = Array.from({ length: 8 }, () => ({
      frequencyHz: 200,
      volume: 0.4,
    }));
    const a = analyzeVoiceSamples(samples);
    const b = analyzeVoiceSamples(samples);
    expect(a.toneLabel).toBe(b.toneLabel);
    expect(a.averagePitchHz).toBe(b.averagePitchHz);
  });
});
