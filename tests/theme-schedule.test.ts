import { it, expect, describe } from "vitest";

import {
  resolveTheme,
  type ThemeSchedule,
  getNextThemeChangeDelay,
} from "../src/features/change-theme/model/theme-schedule";

describe("adaptive theme schedule", () => {
  it("uses dark theme from 18:00 up to 06:00 local time", () => {
    expect(resolveTheme("adaptive", new Date(2026, 9, 29, 18, 0))).toBe("dark");
    expect(resolveTheme("adaptive", new Date(2026, 9, 29, 5, 59))).toBe("dark");
    expect(resolveTheme("adaptive", new Date(2026, 9, 29, 6, 0))).toBe("light");
    expect(resolveTheme("adaptive", new Date(2026, 9, 29, 12, 0))).toBe(
      "light",
    );
  });

  it("accepts a future configurable schedule", () => {
    const schedule: ThemeSchedule = {
      darkFromMinuteOfDay: 20 * 60,
      darkUntilMinuteOfDay: 7 * 60,
    };

    expect(
      resolveTheme("adaptive", new Date(2026, 9, 29, 19, 0), schedule),
    ).toBe("light");
    expect(
      resolveTheme("adaptive", new Date(2026, 9, 29, 20, 0), schedule),
    ).toBe("dark");
  });

  it("returns the delay until the next local schedule boundary", () => {
    expect(getNextThemeChangeDelay(new Date(2026, 9, 29, 17, 0))).toBe(
      60 * 60 * 1_000,
    );
    expect(getNextThemeChangeDelay(new Date(2026, 9, 29, 23, 0))).toBe(
      7 * 60 * 60 * 1_000,
    );
  });
});
