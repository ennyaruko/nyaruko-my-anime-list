import { useTranslation } from "react-i18next";

import {
  LOCALE_STORAGE_KEY,
  supportedLanguages,
  type SupportedLanguage,
} from "@/shared/i18n";

export function useLanguage() {
  const { i18n } = useTranslation();
  const language =
    supportedLanguages.find(
      (supported) => supported === i18n.resolvedLanguage,
    ) ?? "ru";

  const setLanguage = (nextLanguage: SupportedLanguage) => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLanguage);
    } catch {
      // Language switching still works when browser storage is unavailable.
    }

    void i18n.changeLanguage(nextLanguage);
  };

  return { language, setLanguage };
}
