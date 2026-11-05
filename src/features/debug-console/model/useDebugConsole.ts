import { useContext } from "react";

import { DebugConsoleContext } from "./debug-console-context";

export function useDebugConsole() {
  const context = useContext(DebugConsoleContext);
  if (!context) {
    throw new Error("useDebugConsole must be used within DebugConsoleProvider");
  }

  return context;
}
