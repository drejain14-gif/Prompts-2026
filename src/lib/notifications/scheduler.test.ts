import { describe, it, expect } from "vitest";
import {
  getDueCheckInNotifications,
  getNextCheckInTime,
} from "@/lib/notifications/scheduler";
import { buildDefaultSchedule, getCheckInDedupeKey } from "@/lib/constants/check-in-schedule";

describe("check-in scheduler", () => {
  describe("getDueCheckInNotifications", () => {
    it("returns morning notification at 8:00", () => {
      const now = new Date("2026-06-06T08:00:00");
      const due = getDueCheckInNotifications(buildDefaultSchedule(), now, []);
      expect(due.some((n) => n.slot === "morning")).toBe(true);
      expect(due[0].label).toContain("Morning");
    });

    it("returns afternoon notification at 14:00", () => {
      const now = new Date("2026-06-06T14:00:00");
      const due = getDueCheckInNotifications(buildDefaultSchedule(), now, []);
      expect(due.some((n) => n.slot === "afternoon")).toBe(true);
    });

    it("returns evening notification at 20:00", () => {
      const now = new Date("2026-06-06T20:00:00");
      const due = getDueCheckInNotifications(buildDefaultSchedule(), now, []);
      expect(due.some((n) => n.slot === "evening")).toBe(true);
    });

    it("returns empty when no slot matches", () => {
      const now = new Date("2026-06-06T10:30:00");
      const due = getDueCheckInNotifications(buildDefaultSchedule(), now, []);
      expect(due).toHaveLength(0);
    });

    it("excludes dismissed notifications", () => {
      const now = new Date("2026-06-06T08:00:00");
      const key = getCheckInDedupeKey("morning", now);
      const due = getDueCheckInNotifications(buildDefaultSchedule(), now, [key]);
      expect(due).toHaveLength(0);
    });

    it("skips disabled slots", () => {
      const schedule = buildDefaultSchedule().map((s) =>
        s.slot === "morning" ? { ...s, enabled: false } : s
      );
      const now = new Date("2026-06-06T08:00:00");
      const due = getDueCheckInNotifications(schedule, now, []);
      expect(due.some((n) => n.slot === "morning")).toBe(false);
    });
  });

  describe("getCheckInDedupeKey", () => {
    it("generates unique key per slot per day", () => {
      const date = new Date("2026-06-06");
      expect(getCheckInDedupeKey("morning", date)).toBe("checkin-morning-2026-06-06");
      expect(getCheckInDedupeKey("morning", date)).not.toBe(
        getCheckInDedupeKey("evening", date)
      );
    });
  });

  describe("getNextCheckInTime", () => {
    it("returns a future datetime", () => {
      const now = new Date("2026-06-06T10:00:00");
      const next = getNextCheckInTime(buildDefaultSchedule(), now);
      expect(next).not.toBeNull();
      expect(next!.getTime()).toBeGreaterThan(now.getTime());
    });
  });
});

describe("check-in schedule regression", () => {
  it("default schedule has exactly 3 slots", () => {
    expect(buildDefaultSchedule()).toHaveLength(3);
  });

  it("all default slots are enabled", () => {
    for (const slot of buildDefaultSchedule()) {
      expect(slot.enabled).toBe(true);
    }
  });
});
