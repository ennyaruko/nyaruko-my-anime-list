import type { ThemeMode, ResolvedTheme } from "./theme-types";

/** Theme schedule uses local minutes after midnight, so a user setting can be added later. */
export type ThemeSchedule = {
  darkFromMinuteOfDay: number;
  darkUntilMinuteOfDay: number;
};

export const DEFAULT_THEME_SCHEDULE: Readonly<ThemeSchedule> = {
  darkFromMinuteOfDay: 18 * 60,
  darkUntilMinuteOfDay: 6 * 60,
};

export function resolveTheme(
  mode: ThemeMode,
  now: Date = new Date(),
  schedule: Readonly<ThemeSchedule> = DEFAULT_THEME_SCHEDULE,
): ResolvedTheme {
  if (mode !== "adaptive") return mode;

  const currentMinuteOfDay = now.getHours() * 60 + now.getMinutes();
  const { darkFromMinuteOfDay: from, darkUntilMinuteOfDay: until } = schedule;
  const isDark =
    from > until
      ? currentMinuteOfDay >= from || currentMinuteOfDay < until
      : currentMinuteOfDay >= from && currentMinuteOfDay < until;

  return isDark ? "dark" : "light";
}

/** Milliseconds until the next local start/end boundary of the schedule. */
export function getNextThemeChangeDelay(
  now: Date = new Date(),
  schedule: Readonly<ThemeSchedule> = DEFAULT_THEME_SCHEDULE,
): number {
  const boundaries = [
    schedule.darkFromMinuteOfDay,
    schedule.darkUntilMinuteOfDay,
  ];
  const nextBoundary = boundaries
    .map((minuteOfDay) => {
      const boundary = new Date(now);
      boundary.setHours(Math.floor(minuteOfDay / 60), minuteOfDay % 60, 0, 0);
      if (boundary.getTime() <= now.getTime()) {
        boundary.setDate(boundary.getDate() + 1);
      }
      return boundary.getTime();
    })
    .sort((left, right) => left - right)[0];

  return nextBoundary - now.getTime();
}
