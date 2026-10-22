import ruUI from "./locales/ru/ui";
import enUI from "./locales/en/ui";
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
    ui: enUI,
    list: enList,
    login: enLogin,
    common: enCommon,
    validation: enValidation,
  },
  ru: {
    ui: ruUI,
    list: ruList,
    login: ruLogin,
    common: ruCommon,
    validation: ruValidation,
  },
};

export const supportedLanguages = ["ru", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
