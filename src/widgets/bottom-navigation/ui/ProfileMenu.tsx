import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { useLogout } from "@/features/logout";
import { useTheme } from "@/features/change-theme";
import type { ThemeMode } from "@/features/change-theme";
import { useLanguage } from "@/features/change-language";
import { useAdultContent } from "@/features/toggle-adult-content";
import { useAutoTranslationPreferences } from "@/features/translate-content";

import { useAuth } from "@/entities/auth";
import type { MediaContentMode } from "@/entities/media";
import type { AccountProfile } from "@/entities/account";

import { Switch } from "@/shared/ui";
import type { SupportedLanguage } from "@/shared/i18n";
import {
  ExitIcon,
  UserIcon,
  ThemeSunIcon,
  ThemeAutoIcon,
  ThemeMoonIcon,
  TranslationIcon,
  AdultContentIcon,
  ExternalLinkIcon,
} from "@/shared/icons";

import { ProfileSetting } from "./ProfileSetting";
import { ProfileMenuSection } from "./ProfileMenuSection";

import * as styles from "./ProfileMenu.css";

export type ProfileMenuProps = {
  onClose: VoidFunction;
  account?: AccountProfile;
  onAdultContentEnableRequest: (mode: MediaContentMode) => void;
};

const languageCodes: SupportedLanguage[] = ["en", "ru"];

export function ProfileMenu({
  account,
  onClose,
  onAdultContentEnableRequest,
}: ProfileMenuProps) {
  const { t } = useTranslation(["common"]);
  const { identityProvider } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { mode: contentMode, setMode: setContentMode } = useAdultContent();
  const { enabled: autoTranslation, setEnabled: setAutoTranslation } =
    useAutoTranslationPreferences();
  const logout = useLogout();
  const themeLabels: Record<ThemeMode, string> = {
    dark: t("common:profileMenu.darkTheme"),
    light: t("common:profileMenu.lightTheme"),
    adaptive: t("common:profileMenu.adaptiveTheme"),
  };
  const themeLabel = themeLabels[theme];
  const themePositions = ["dark", "light", "adaptive"] as const;
  const themePosition = themePositions.indexOf(theme) as 0 | 1 | 2;
  const profileUrl = account?.profileUrl;

  const handleLogout = () => {
    onClose();
    void logout();
  };

  const contentModes: MediaContentMode[] = ["safe", "ecchi", "hentai"];
  const contentModeLabels: Record<MediaContentMode, string> = {
    safe: t("common:profileMenu.safeContentMode"),
    ecchi: t("common:profileMenu.ecchiContentMode"),
    hentai: t("common:profileMenu.hentaiContentMode"),
  };
  const contentModePosition = contentModes.indexOf(contentMode) as 0 | 1 | 2;

  const handleContentModeChange = (position: 0 | 1 | 2) => {
    const nextMode = contentModes[position];
    if (nextMode === "safe") {
      setContentMode(nextMode);
      return;
    }

    if (account?.adultContentEnabled) {
      setContentMode(nextMode);
      return;
    }

    onAdultContentEnableRequest(nextMode);
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
        <ProfileSetting label={t("common:translation.description")}>
          <Switch
            checked={autoTranslation.description}
            onCheckedChange={(checked) =>
              setAutoTranslation("description", checked)
            }
          >
            <TranslationIcon
              className={
                autoTranslation.description
                  ? styles.translationIcon.enabled
                  : styles.translationIcon.disabled
              }
            />
          </Switch>
        </ProfileSetting>
        <ProfileSetting label={t("common:translation.reviews")}>
          <Switch
            checked={autoTranslation.reviews}
            onCheckedChange={(checked) =>
              setAutoTranslation("reviews", checked)
            }
          >
            <TranslationIcon
              className={
                autoTranslation.reviews
                  ? styles.translationIcon.enabled
                  : styles.translationIcon.disabled
              }
            />
          </Switch>
        </ProfileSetting>
      </ProfileMenuSection>

      <ProfileMenuSection title={t("common:profileMenu.settings")}>
        <ProfileSetting label={themeLabel}>
          <Switch
            label={themeLabel}
            position={themePosition}
            thumbClassName={styles.themeThumb}
            onPositionChange={(position) => setTheme(themePositions[position])}
          >
            {theme === "dark" ? (
              <ThemeMoonIcon className={styles.moonIcon} />
            ) : theme === "light" ? (
              <ThemeSunIcon className={styles.sunIcon} />
            ) : (
              <ThemeAutoIcon className={styles.autoIcon} />
            )}
          </Switch>
        </ProfileSetting>
        <ProfileSetting label={`${contentModeLabels[contentMode]}`}>
          <Switch
            position={contentModePosition}
            label={contentModeLabels[contentMode]}
            onPositionChange={handleContentModeChange}
            thumbClassName={styles.adultContentThumb[contentMode]}
          >
            <AdultContentIcon
              className={styles.adultContentIcon[contentMode]}
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
