import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from "react";

import { TranslationPreferencesContext } from "./translation-preferences";
import type {
  TranslationContentKind,
  AutoTranslationPreferences,
} from "./translation-preferences";

const STORAGE_KEYS: Record<TranslationContentKind, string> = {
  reviews: "anime-list:auto-translation:reviews",
  description: "anime-list:auto-translation:description",
};
const DEFAULT_PREFERENCES: AutoTranslationPreferences = {
  reviews: false,
  description: true,
};

function readPreferences(): AutoTranslationPreferences {
  try {
    const preferences = {
      reviews: localStorage.getItem(STORAGE_KEYS.reviews) === "true",
      description: localStorage.getItem(STORAGE_KEYS.description) === "true",
    };

    return preferences.reviews || preferences.description
      ? preferences
      : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function TranslationPreferencesProvider({
  children,
}: PropsWithChildren) {
  const [enabled, setState] = useState(DEFAULT_PREFERENCES);
  useEffect(() => {
    setState(readPreferences());
    const onStorage = (event: StorageEvent) => {
      const kind = (Object.keys(STORAGE_KEYS) as TranslationContentKind[]).find(
        (key) => STORAGE_KEYS[key] === event.key,
      );
      if (event.key === null || kind) setState(readPreferences());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const setEnabled = useCallback(
    (kind: TranslationContentKind, value: boolean) => {
      setState((current) => ({ ...current, [kind]: value }));
      try {
        localStorage.setItem(STORAGE_KEYS[kind], String(value));
      } catch {
        /* Keep the session preference. */
      }
    },
    [],
  );
  const value = useMemo(() => ({ enabled, setEnabled }), [enabled, setEnabled]);
  return (
    <TranslationPreferencesContext.Provider value={value}>
      {children}
    </TranslationPreferencesContext.Provider>
  );
}
