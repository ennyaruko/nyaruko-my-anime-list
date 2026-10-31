import { createContext } from "react";

import type { ThemeMode } from "./theme-types";

export type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

export const ThemeContext = createContext<null | ThemeContextValue>(null);
