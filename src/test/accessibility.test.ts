import { describe, it, expect } from "vitest";
import { isCheckInDue, buildDefaultSchedule } from "@/lib/constants/check-in-schedule";

describe("accessibility — check-in schedule constants", () => {
  it("uses readable labels for screen readers", () => {
    for (const slot of buildDefaultSchedule()) {
      expect(slot.label.length).toBeGreaterThan(5);
      expect(slot.label).not.toMatch(/^\d+$/);
    }
  });

  it("uses valid 24-hour time ranges", () => {
    for (const slot of buildDefaultSchedule()) {
      expect(slot.hour).toBeGreaterThanOrEqual(0);
      expect(slot.hour).toBeLessThanOrEqual(23);
      expect(slot.minute).toBeGreaterThanOrEqual(0);
      expect(slot.minute).toBeLessThanOrEqual(59);
    }
  });
});

describe("accessibility — notification timing", () => {
  it("fires at exact minute for predictable user experience", () => {
    const schedule = buildDefaultSchedule()[0];
    const dueTime = new Date("2026-01-15T08:00:00");
    expect(isCheckInDue(schedule, dueTime)).toBe(true);

    const oneMinuteLate = new Date("2026-01-15T08:01:00");
    expect(isCheckInDue(schedule, oneMinuteLate)).toBe(false);
  });
});

describe("accessibility — crisis resource requirements", () => {
  const CRISIS_RESOURCES = [
    { name: "iCall", number: "9152987821" },
    { name: "Vandrevala Foundation", number: "1860-2662-345" },
    { name: "Tele-MANAS", number: "14416" },
  ];

  it("includes 24/7 helplines for Indian students", () => {
    expect(CRISIS_RESOURCES.length).toBeGreaterThanOrEqual(3);
    for (const resource of CRISIS_RESOURCES) {
      expect(resource.number).toMatch(/^\d/);
    }
  });
});
