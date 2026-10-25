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

export type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    setThemeState(
      document.documentElement.classList.contains(lightTheme)
        ? "light"
        : "dark",
    );
  }, []);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove(lightTheme, darkTheme);
    root.classList.add(nextTheme === "light" ? lightTheme : darkTheme);
    root.style.colorScheme = nextTheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute(
      "content",
      nextTheme === "light" ? "#FFFFFF" : "#151719",
    );

    setThemeState(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The active theme still changes when browser storage is unavailable.
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [setTheme, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
