export type ThemeMode = "dark" | "light" | "adaptive";

export type ResolvedTheme = Exclude<ThemeMode, "adaptive">;

export const THEME_STORAGE_KEY = "theme";
