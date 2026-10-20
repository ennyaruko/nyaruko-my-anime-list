import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { resources, supportedLanguages } from "./resources";

export const LOCALE_STORAGE_KEY = "my-anime-list:locale";

const activeLanguage = i18n.isInitialized ? i18n.language : undefined;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...(activeLanguage ? { lng: activeLanguage } : {}),
    resources,
    fallbackLng: "ru",
    returnNull: false,
    defaultNS: "common",
    load: "languageOnly",
    enableSelector: false,
    supportedLngs: [...supportedLanguages],
    ns: ["common", "login", "validation, list"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [],
      caches: [],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
    },
  });

export default i18n;
