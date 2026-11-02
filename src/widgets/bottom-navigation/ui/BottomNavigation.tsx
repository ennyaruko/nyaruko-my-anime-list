import { useState } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";
import { Popover } from "radix-ui";

import { resetMediaFilterDrafts } from "@/features/filters";
import {
  useAdultContent,
  useEnableAdultContent,
  AdultContentConfirmationDialog,
} from "@/features/toggle-adult-content";

import type { AccountProfile } from "@/entities/account";

import { ListIcon, UserIcon, SearchIcon } from "@/shared/icons";

import { ProfileMenu } from "./ProfileMenu";
import { NavigationItem } from "./NavigationItem";

import * as styles from "./BottomNavigation.css";
import * as navigationItemStyles from "./NavigationItem.css";

export type BottomNavigationProps = {
  account?: AccountProfile;
};

export function BottomNavigation({ account }: BottomNavigationProps) {
  const { t } = useTranslation(["common"]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adultContentConfirmationOpen, setAdultContentConfirmationOpen] =
    useState(false);
  const { setEnabled: setAdultContentEnabled } = useAdultContent();
  const enableAdultContent = useEnableAdultContent();

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const handleAdultContentEnableRequest = () => {
    setProfileOpen(false);
    setAdultContentConfirmationOpen(true);
  };

  const handleAdultContentConfirm = async () => {
    let enabled: boolean;
    try {
      enabled = await enableAdultContent.enable();
    } catch {
      return;
    }

    if (!enabled) return;
    setAdultContentEnabled(true);
    setAdultContentConfirmationOpen(false);
  };

  return (
    <>
      <Popover.Root open={profileOpen} onOpenChange={setProfileOpen}>
        <Popover.Anchor asChild>
          <nav className={styles.root}>
            <NavigationItem
              end
              to="/"
              label={t("common:navigation.myAnime")}
              icon={<ListIcon className={navigationItemStyles.icon} />}
            />
            <NavigationItem
              to="/search"
              label={t("common:navigation.search")}
              icon={<SearchIcon className={navigationItemStyles.icon} />}
              onClick={() => {
                resetMediaFilterDrafts("search");
              }}
            />
            <Popover.Trigger
              type="button"
              className={clsx(navigationItemStyles.root, {
                [navigationItemStyles.state.active]: profileOpen,
                [navigationItemStyles.state.default]: !profileOpen,
              })}
            >
              <UserIcon className={navigationItemStyles.icon} />
              <span className={navigationItemStyles.label}>
                {t("common:navigation.profile")}
              </span>
            </Popover.Trigger>
          </nav>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content
            side="top"
            align="end"
            alignOffset={6}
            sideOffset={12}
            collisionPadding={8}
            className={styles.popover}
          >
            <ProfileMenu
              account={account}
              onClose={handleProfileClose}
              onAdultContentEnableRequest={handleAdultContentEnableRequest}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <AdultContentConfirmationDialog
        open={adultContentConfirmationOpen}
        pending={enableAdultContent.isPending}
        onConfirm={() => void handleAdultContentConfirm()}
        onCancel={() => setAdultContentConfirmationOpen(false)}
      />
    </>
  );
}
