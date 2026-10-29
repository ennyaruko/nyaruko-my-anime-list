import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { darkTheme, lightTheme } from "@/shared/styles";

import { ThemeContext } from "./theme-context";
import { type ThemeMode, THEME_STORAGE_KEY } from "./theme-types";
import {
  resolveTheme,
  DEFAULT_THEME_SCHEDULE,
  getNextThemeChangeDelay,
} from "./theme-schedule";

export type ThemeProviderProps = {
  children: ReactNode;
};

function isThemeMode(value: null | string): value is ThemeMode {
  return value === "dark" || value === "light" || value === "adaptive";
}

function getInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(storedTheme)) return storedTheme;
  } catch {
    // Use the theme already applied by the early document initializer.
  }

  if (document.documentElement.classList.contains(lightTheme)) return "light";
  if (document.documentElement.classList.contains(darkTheme)) return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyResolvedTheme(mode: ThemeMode) {
  const resolvedTheme = resolveTheme(mode, new Date(), DEFAULT_THEME_SCHEDULE);
  const root = document.documentElement;

  root.classList.remove(lightTheme, darkTheme);
  root.classList.add(resolvedTheme === "light" ? lightTheme : darkTheme);
  root.style.colorScheme = resolvedTheme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute(
    "content",
    resolvedTheme === "light" ? "#FFFFFF" : "#151719",
  );
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialThemeMode);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The active theme still changes when browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    let timeoutId: number | undefined;

    const synchronizeTheme = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      applyResolvedTheme(theme);

      if (theme === "adaptive") {
        timeoutId = window.setTimeout(
          synchronizeTheme,
          getNextThemeChangeDelay(new Date(), DEFAULT_THEME_SCHEDULE),
        );
      }
    };

    synchronizeTheme();
    if (theme !== "adaptive") return;

    const handleSystemTimeResume = () => synchronizeTheme();
    window.addEventListener("focus", handleSystemTimeResume);
    document.addEventListener("visibilitychange", handleSystemTimeResume);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.removeEventListener("focus", handleSystemTimeResume);
      document.removeEventListener("visibilitychange", handleSystemTimeResume);
    };
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [setTheme, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
