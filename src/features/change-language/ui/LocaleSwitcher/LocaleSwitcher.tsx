import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { LOCALE_STORAGE_KEY, supportedLanguages } from "@/shared/i18n";

import * as styles from "./LocaleSwitcher.css";

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation(["common"]);
  const currentLanguage = i18n.resolvedLanguage ?? "ru";

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.currentTarget.value;

    if (supportedLanguages.some((language) => language === nextLanguage)) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLanguage);
      void i18n.changeLanguage(nextLanguage);
    }
  };

  return (
    <label className={styles.root}>
      <span>{t("common:language.label")}</span>
      <select
        onChange={handleChange}
        value={currentLanguage}
        className={styles.select}
      >
        <option value="ru">{t("common:language.russian")}</option>
        <option value="en">{t("common:language.english")}</option>
      </select>
    </label>
  );
}
