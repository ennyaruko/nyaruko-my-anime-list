import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import type { MediaContentMode } from "@/entities/media";

import { AdultContentContext } from "./adult-content-context";

export type { AdultContentContextValue } from "./adult-content-context";

export type AdultContentProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY = "anime-list:content-mode";
const contentModes: MediaContentMode[] = ["safe", "ecchi", "hentai"];

function readStoredMode(): MediaContentMode {
  try {
    const storedMode = window.localStorage.getItem(STORAGE_KEY);
    if (contentModes.includes(storedMode as MediaContentMode)) {
      return storedMode as MediaContentMode;
    }

    window.localStorage.setItem(STORAGE_KEY, "safe");
    return "safe";
  } catch {
    return "safe";
  }
}

export function AdultContentProvider({ children }: AdultContentProviderProps) {
  const [mode, setModeState] = useState<MediaContentMode>("safe");
  useEffect(() => {
    setModeState(readStoredMode());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === STORAGE_KEY) {
        setModeState(readStoredMode());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateMode = useCallback((nextMode: MediaContentMode) => {
    setModeState(nextMode);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextMode);
    } catch {
      // Keep the setting active for this session when storage is unavailable.
    }
  }, []);

  const value = useMemo(
    () => ({ mode, setMode: updateMode }),
    [mode, updateMode],
  );

  return (
    <AdultContentContext.Provider value={value}>
      {children}
    </AdultContentContext.Provider>
  );
}
