import { useEffect, type ReactNode } from "react";

import { setPersistenceErrorHandler } from "@/shared/lib";

/** Central, privacy-safe diagnostics for best-effort browser infrastructure. */
export function AppDiagnosticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const handleAuthCleanupError = () => {
      console.warn(
        "[my-anime-list] Auth cleanup did not complete successfully",
      );
    };
    const handlePersistenceError = (event: Event) => {
      const operation = (event as CustomEvent<{ operation?: unknown }>).detail
        ?.operation;
      if (
        operation === "read" ||
        operation === "write" ||
        operation === "remove"
      ) {
        console.warn("[my-anime-list] Browser persistence operation failed", {
          operation,
        });
      }
    };

    window.addEventListener(
      "my-anime-list:auth-cleanup-error",
      handleAuthCleanupError,
    );
    window.addEventListener(
      "my-anime-list:persistence-error",
      handlePersistenceError,
    );
    setPersistenceErrorHandler((operation) => {
      window.dispatchEvent(
        new CustomEvent("my-anime-list:persistence-error", {
          detail: { operation },
        }),
      );
    });

    return () => {
      setPersistenceErrorHandler(null);
      window.removeEventListener(
        "my-anime-list:auth-cleanup-error",
        handleAuthCleanupError,
      );
      window.removeEventListener(
        "my-anime-list:persistence-error",
        handlePersistenceError,
      );
    };
  }, []);

  return children;
}
