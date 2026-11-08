import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from "react";

import type { WatchContinuation } from "./watch-continuation";
import { WatchContinuationContext } from "./watch-continuation";

const STORAGE_KEY = "anime-list:watch-continuation";

function isWatchContinuation(value: unknown): value is WatchContinuation {
  if (typeof value !== "object" || value === null) return false;

  const continuation = value as Partial<WatchContinuation>;
  if (
    typeof continuation.userId !== "string" ||
    typeof continuation.mediaId !== "number" ||
    !Number.isSafeInteger(continuation.mediaId) ||
    continuation.mediaId <= 0 ||
    (continuation.contentMode !== "safe" &&
      continuation.contentMode !== "ecchi")
  )
    return false;

  if (continuation.source === "yummyani")
    return (
      typeof continuation.episode === "number" &&
      Number.isSafeInteger(continuation.episode) &&
      continuation.episode > 0 &&
      typeof continuation.trackId === "string" &&
      typeof continuation.playerId === "string"
    );

  if (continuation.source === "embed")
    return (
      continuation.language === "en" &&
      typeof continuation.episode === "number" &&
      Number.isSafeInteger(continuation.episode) &&
      continuation.episode > 0 &&
      typeof continuation.embedId === "string"
    );

  return (
    continuation.source === "kodik" && continuation.embedId === "playerKodikRu"
  );
}

function readContinuation(): null | WatchContinuation {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const value: unknown = JSON.parse(raw);
    return isWatchContinuation(value) ? value : null;
  } catch {
    return null;
  }
}

export function WatchContinuationProvider({ children }: PropsWithChildren) {
  const [continuation, setContinuation] = useState<null | WatchContinuation>(
    null,
  );

  useEffect(() => {
    setContinuation(readContinuation());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === STORAGE_KEY)
        setContinuation(readContinuation());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveContinuation = useCallback((next: WatchContinuation) => {
    setContinuation(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the current continuation for this app session.
    }
  }, []);

  const clearContinuation = useCallback(() => {
    setContinuation(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Keep the in-memory state cleared when storage is unavailable.
    }
  }, []);

  const value = useMemo(
    () => ({ continuation, saveContinuation, clearContinuation }),
    [continuation, saveContinuation, clearContinuation],
  );

  return (
    <WatchContinuationContext.Provider value={value}>
      {children}
    </WatchContinuationContext.Provider>
  );
}
