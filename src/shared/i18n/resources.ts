import ruList from "./locales/ru/list";
import enList from "./locales/en/list";
import enLogin from "./locales/en/login";
import ruLogin from "./locales/ru/login";
import enCommon from "./locales/en/common";
import ruCommon from "./locales/ru/common";
import enValidation from "./locales/en/validation";
import ruValidation from "./locales/ru/validation";

export const resources = {
  en: {
    list: enList,
    login: enLogin,
    common: enCommon,
    validation: enValidation,
  },
  ru: {
    list: ruList,
    login: ruLogin,
    common: ruCommon,
    validation: ruValidation,
  },
};

export const supportedLanguages = ["ru", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
