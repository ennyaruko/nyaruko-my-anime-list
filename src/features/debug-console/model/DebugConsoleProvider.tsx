import { useState, useEffect, type ReactNode } from "react";

import {
  type DebugLogEntry,
  type DebugLogLevel,
  DebugConsoleContext,
} from "./debug-console-context";

const maxEntries = 300;
const consoleLevels: DebugLogLevel[] = ["log", "info", "warn", "error"];

function formatValue(value: unknown) {
  if (typeof value === "string") return value;
  if (value instanceof Error) {
    return value.stack ?? `${value.name}: ${value.message}`;
  }

  try {
    const seen = new WeakSet<object>();
    const serialized = JSON.stringify(value, (_key, nestedValue: unknown) => {
      if (typeof nestedValue === "object" && nestedValue !== null) {
        if (seen.has(nestedValue)) return "[Circular]";
        seen.add(nestedValue);
      }
      return nestedValue;
    });
    return serialized ?? String(value);
  } catch {
    return String(value);
  }
}

function formatArguments(args: unknown[]) {
  return args.map(formatValue).join(" ");
}

export type DebugConsoleProviderProps = {
  children: ReactNode;
};

export function DebugConsoleProvider({ children }: DebugConsoleProviderProps) {
  const [entries, setEntries] = useState<DebugLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let nextId = 0;
    const appendEntry = (level: DebugLogLevel, message: string) => {
      setEntries((currentEntries) =>
        [
          ...currentEntries,
          { level, message, id: nextId++, timestamp: Date.now() },
        ].slice(-maxEntries),
      );
    };

    const originals = new Map<DebugLogLevel, (...args: unknown[]) => void>();
    for (const level of consoleLevels) {
      const original = console[level].bind(console) as (
        ...args: unknown[]
      ) => void;
      originals.set(level, original);
      console[level] = (...args: unknown[]) => {
        original(...args);
        appendEntry(level, formatArguments(args));
      };
    }

    const handleError = (event: ErrorEvent) => {
      appendEntry(
        "error",
        event.error ? formatValue(event.error) : event.message,
      );
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      appendEntry(
        "error",
        `Unhandled promise rejection: ${formatValue(event.reason)}`,
      );
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      for (const level of consoleLevels) {
        const original = originals.get(level);
        if (original) console[level] = original;
      }
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  const value = {
    isOpen,
    entries,
    clearEntries: () => setEntries([]),
    openConsole: () => setIsOpen(true),
    closeConsole: () => setIsOpen(false),
  };

  return (
    <DebugConsoleContext.Provider value={value}>
      {children}
    </DebugConsoleContext.Provider>
  );
}
