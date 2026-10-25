import enCommon from "./locales/en/common";
import ruCommon from "./locales/ru/common";

export const resources = {
  en: { common: enCommon },
  ru: { common: ruCommon },
};

export const supportedLanguages = ["ru", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
