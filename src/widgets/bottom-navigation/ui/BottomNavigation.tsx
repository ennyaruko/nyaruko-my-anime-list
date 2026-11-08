import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import clsx from "clsx";
import { Popover } from "radix-ui";

import { resetMediaFilterDrafts } from "@/features/filters";
import { useSearchPosition } from "@/features/search-position";
import { useWatchContinuation } from "@/features/watch-continuation";
import { SEARCH_POSITION_RESTORE_STATE_KEY } from "@/features/search-position";
import {
  useAdultContent,
  useEnableAdultContent,
  AdultContentConfirmationDialog,
} from "@/features/toggle-adult-content";

import type { AccountProfile } from "@/entities/account";
import type { MediaContentMode } from "@/entities/media";

import { ListIcon, UserIcon, SearchIcon } from "@/shared/icons";

import { ProfileMenu } from "./ProfileMenu";
import { NavigationItem } from "./NavigationItem";
import { QuickActionsMenu } from "./QuickActionsMenu";

import * as styles from "./BottomNavigation.css";
import * as navigationItemStyles from "./NavigationItem.css";

export type BottomNavigationProps = {
  account?: AccountProfile;
};

export function BottomNavigation({ account }: BottomNavigationProps) {
  const { t } = useTranslation(["common"]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [requestedContentMode, setRequestedContentMode] =
    useState<null | MediaContentMode>(null);
  const { mode: contentMode, setMode: setContentMode } = useAdultContent();
  const { savedPosition, isLoaded: isSearchPositionLoaded } = useSearchPosition(
    {
      contentMode,
      userId: account?.id,
    },
  );
  const { continuation } = useWatchContinuation(account?.id);
  const navigate = useNavigate();
  const enableAdultContent = useEnableAdultContent();

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const handleAdultContentEnableRequest = (mode: MediaContentMode) => {
    setProfileOpen(false);
    setRequestedContentMode(mode);
  };

  const handleContinueSearch = () => {
    if (!savedPosition) return;

    resetMediaFilterDrafts("search");
    navigate("/search", {
      state: { [SEARCH_POSITION_RESTORE_STATE_KEY]: true },
    });
  };

  const handleContinueWatching = () => {
    if (!continuation) return;

    setContentMode(continuation.contentMode);
    navigate(`/media/${continuation.mediaId}/watch`);
  };

  const handleAdultContentConfirm = async () => {
    if (!requestedContentMode) return;

    let enabled: boolean;
    try {
      enabled = await enableAdultContent.enable();
    } catch {
      return;
    }

    if (!enabled) return;
    setContentMode(requestedContentMode);
    setRequestedContentMode(null);
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
            <QuickActionsMenu
              onContinueSearch={handleContinueSearch}
              onContinueWatching={handleContinueWatching}
              showContinueWatching={contentMode !== "hentai"}
              canContinueSearch={
                isSearchPositionLoaded && savedPosition !== null
              }
              canContinueWatching={Boolean(
                continuation &&
                (continuation.contentMode !== "ecchi" ||
                  account?.adultContentEnabled),
              )}
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
        open={requestedContentMode !== null}
        pending={enableAdultContent.isPending}
        onCancel={() => setRequestedContentMode(null)}
        onConfirm={() => void handleAdultContentConfirm()}
      />
    </>
  );
}
