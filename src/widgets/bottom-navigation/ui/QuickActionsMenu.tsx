import { useState } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";
import { Popover } from "radix-ui";

import { ViewIcon, SearchIcon, QuickActionIcon } from "@/shared/icons";

import { ProfileMenuSection } from "./ProfileMenuSection";

import * as styles from "./QuickActionsMenu.css";
import * as navigationStyles from "./BottomNavigation.css";
import * as navigationItemStyles from "./NavigationItem.css";

export type QuickActionsMenuProps = {
  canContinueSearch: boolean;
  canContinueWatching: boolean;
  showContinueWatching: boolean;
  onContinueSearch: VoidFunction;
  onContinueWatching: VoidFunction;
};

export function QuickActionsMenu({
  onContinueSearch,
  canContinueSearch,
  onContinueWatching,
  canContinueWatching,
  showContinueWatching,
}: QuickActionsMenuProps) {
  const { t } = useTranslation(["common"]);
  const [open, setOpen] = useState(false);

  const handleContinueSearch = () => {
    setOpen(false);
    onContinueSearch();
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        type="button"
        className={clsx(navigationItemStyles.root, {
          [navigationItemStyles.state.active]: open,
          [navigationItemStyles.state.default]: !open,
        })}
      >
        <QuickActionIcon className={navigationItemStyles.icon} />
        <span className={navigationItemStyles.label}>
          {t("common:navigation.actions")}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={12}
          collisionPadding={8}
          className={navigationStyles.popover}
        >
          <ProfileMenuSection title={t("common:quickActions.sectionTitle")}>
            {showContinueWatching && (
              <button
                type="button"
                className={styles.action}
                disabled={!canContinueWatching}
                onClick={() => {
                  setOpen(false);
                  onContinueWatching();
                }}
              >
                <ViewIcon className={styles.actionIcon} />
                {t("common:quickActions.continueWatching")}
              </button>
            )}
            <button
              type="button"
              className={styles.action}
              disabled={!canContinueSearch}
              onClick={handleContinueSearch}
            >
              <SearchIcon className={styles.actionIcon} />
              {t("common:quickActions.continueSearch")}
            </button>
          </ProfileMenuSection>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
