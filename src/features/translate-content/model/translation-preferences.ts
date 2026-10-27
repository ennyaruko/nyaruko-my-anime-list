import { useState, useContext, createContext } from "react";

export type ContentLanguage = "en" | "ru";
export type TranslationContentKind = "reviews" | "description";
export type AutoTranslationPreferences = Record<
  TranslationContentKind,
  boolean
>;

export const TranslationPreferencesContext = createContext<null | {
  enabled: AutoTranslationPreferences;
  setEnabled: (kind: TranslationContentKind, enabled: boolean) => void;
}>(null);

export function useAutoTranslationPreferences() {
  const context = useContext(TranslationPreferencesContext);
  if (!context) throw new Error("TranslationPreferencesProvider is missing");
  return context;
}

/** A manual override belongs only to this content and the current preference. */
export function useContentLanguage(
  scope: string | number,
  kind: TranslationContentKind,
) {
  const { enabled } = useAutoTranslationPreferences();
  const automatic = enabled[kind];
  const defaultLanguage: ContentLanguage = automatic ? "ru" : "en";
  const [selection, setSelection] = useState({
    scope,
    automatic,
    language: defaultLanguage,
  });
  const changed =
    selection.scope !== scope || selection.automatic !== automatic;
  if (changed) setSelection({ scope, automatic, language: defaultLanguage });
  return {
    language: changed ? defaultLanguage : selection.language,
    setLanguage: (language: ContentLanguage) =>
      setSelection({ scope, language, automatic }),
  };
}
