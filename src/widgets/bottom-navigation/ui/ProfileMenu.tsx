import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { useLogout } from "@/features/logout";
import { useTheme } from "@/features/change-theme";
import { useLanguage } from "@/features/change-language";
import { useAdultContent } from "@/features/toggle-adult-content";

import { useAuth } from "@/entities/auth";
import type { AccountProfile } from "@/entities/account";

import { Switch } from "@/shared/ui";
import type { SupportedLanguage } from "@/shared/i18n";
import {
  ExitIcon,
  UserIcon,
  ThemeSunIcon,
  ThemeMoonIcon,
  AdultContentIcon,
  ExternalLinkIcon,
} from "@/shared/icons";

import { ProfileSetting } from "./ProfileSetting";
import { ProfileMenuSection } from "./ProfileMenuSection";

import * as styles from "./ProfileMenu.css";

export type ProfileMenuProps = {
  onClose: VoidFunction;
  account?: AccountProfile;
};

const languageCodes: SupportedLanguage[] = ["en", "ru"];

export function ProfileMenu({ account, onClose }: ProfileMenuProps) {
  const { t } = useTranslation(["common"]);
  const { identityProvider } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { enabled: adultContentEnabled, setEnabled: setAdultContentEnabled } =
    useAdultContent();
  const logout = useLogout();
  const isLightTheme = theme === "light";
  const profileUrl = account?.profileUrl;

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  const handleLogout = () => {
    onClose();
    void logout();
  };

  const summary = (
    <>
      {account?.avatarUrl ? (
        <img alt="" src={account.avatarUrl} className={styles.avatar} />
      ) : (
        <UserIcon className={styles.avatarFallback} />
      )}
      <span className={styles.details}>
        <span className={styles.heading}>
          <span className={styles.username}>
            {account?.username ?? identityProvider.displayName}
          </span>
          {profileUrl ? (
            <ExternalLinkIcon className={styles.externalLinkIcon} />
          ) : null}
        </span>
        <span className={styles.provider}>
          {t("common:profileMenu.provider", {
            provider: identityProvider.displayName,
          })}
        </span>
      </span>
    </>
  );

  return (
    <>
      <ProfileMenuSection title={t("common:navigation.profile")}>
        {profileUrl ? (
          <Link
            to={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(styles.profile, styles.profileLink)}
          >
            {summary}
          </Link>
        ) : (
          <div className={styles.profile}>{summary}</div>
        )}
      </ProfileMenuSection>

      <ProfileMenuSection title={t("common:language.label")}>
        <div data-language={language} className={styles.languageOptions}>
          <span className={styles.languageIndicator} />
          {languageCodes.map((languageCode) => (
            <button
              type="button"
              key={languageCode}
              onClick={() => setLanguage(languageCode)}
              className={clsx(styles.languageOption, {
                [styles.languageOptionState.active]: language === languageCode,
                [styles.languageOptionState.default]: language !== languageCode,
              })}
            >
              {languageCode.toUpperCase()}
            </button>
          ))}
        </div>
      </ProfileMenuSection>

      <ProfileMenuSection title={t("common:profileMenu.settings")}>
        <ProfileSetting
          label={
            isLightTheme
              ? t("common:profileMenu.lightTheme")
              : t("common:profileMenu.darkTheme")
          }
        >
          <Switch
            checked={isLightTheme}
            thumbClassName={styles.themeThumb}
            onCheckedChange={handleThemeChange}
          >
            {isLightTheme ? (
              <ThemeSunIcon className={styles.sunIcon} />
            ) : (
              <ThemeMoonIcon className={styles.moonIcon} />
            )}
          </Switch>
        </ProfileSetting>
        <ProfileSetting label={t("common:profileMenu.adultContent")}>
          <Switch
            checked={adultContentEnabled}
            onCheckedChange={setAdultContentEnabled}
            thumbClassName={
              adultContentEnabled
                ? styles.adultContentThumb.enabled
                : styles.adultContentThumb.disabled
            }
          >
            <AdultContentIcon
              className={
                adultContentEnabled
                  ? styles.adultContentIcon.enabled
                  : styles.adultContentIcon.disabled
              }
            />
          </Switch>
        </ProfileSetting>
      </ProfileMenuSection>

      <ProfileMenuSection title={t("common:profileMenu.session")}>
        <button type="button" onClick={handleLogout} className={styles.logout}>
          <span className={styles.logoutIconSlot}>
            <ExitIcon className={styles.logoutIcon} />
          </span>
          <span className={styles.logoutLabel}>
            {t("common:profileMenu.logout")}
          </span>
        </button>
      </ProfileMenuSection>
    </>
  );
}
