import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { resources, supportedLanguages } from "./resources";

void i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: "ru",
  returnNull: false,
  defaultNS: "common",
  load: "languageOnly",
  enableSelector: false,
  ns: ["common", "login", "validation"],
  supportedLngs: [...supportedLanguages],
  interpolation: {
    escapeValue: false,
  },
  detection: {
    caches: ["localStorage"],
    order: ["localStorage", "navigator"],
    lookupLocalStorage: "my-anime-list:locale",
  },
});

export default i18n;
