import { createContext } from "react";

export type DebugLogLevel = "log" | "info" | "warn" | "error";

export type DebugLogEntry = {
  id: number;
  message: string;
  timestamp: number;
  level: DebugLogLevel;
};

export type DebugConsoleContextValue = {
  isOpen: boolean;
  entries: DebugLogEntry[];
  openConsole: VoidFunction;
  clearEntries: VoidFunction;
  closeConsole: VoidFunction;
};

export const DebugConsoleContext =
  createContext<null | DebugConsoleContextValue>(null);
