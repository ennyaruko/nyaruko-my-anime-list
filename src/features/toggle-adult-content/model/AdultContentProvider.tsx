import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { AdultContentContext } from "./adult-content-context";

export type { AdultContentContextValue } from "./adult-content-context";

export type AdultContentProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY = "anime-list:adult-content:enabled";

function readStoredPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function AdultContentProvider({ children }: AdultContentProviderProps) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(readStoredPreference());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === STORAGE_KEY) {
        setEnabled(readStoredPreference());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateEnabled = useCallback((nextEnabled: boolean) => {
    setEnabled(nextEnabled);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(nextEnabled));
    } catch {
      // Keep the setting active for this session when storage is unavailable.
    }
  }, []);

  const value = useMemo(
    () => ({ enabled, setEnabled: updateEnabled }),
    [enabled, updateEnabled],
  );

  return (
    <AdultContentContext.Provider value={value}>
      {children}
    </AdultContentContext.Provider>
  );
}
