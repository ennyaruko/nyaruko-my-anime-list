import { useState } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import type { Media, MediaListStatus } from "@/entities/media";

import { PlusIcon, ArrowDownIcon } from "@/shared/icons";

import { useMediaListActions } from "../model/useMediaListActions";

import * as styles from "./MediaListMenu.css";

export type MediaListMenuProps = {
  media: Media;
  userId: string | undefined;
};

const statusOptions: MediaListStatus[] = [
  "PLANNING",
  "CURRENT",
  "COMPLETED",
  "REPEATING",
  "DROPPED",
  "PAUSED",
];

const statusTranslationKey = {
  PAUSED: "common:ui.watchStatus.paused",
  DROPPED: "common:ui.watchStatus.dropped",
  CURRENT: "common:ui.watchStatus.watching",
  PLANNING: "common:ui.watchStatus.planned",
  REPEATING: "common:ui.watchStatus.repeating",
  COMPLETED: "common:ui.watchStatus.completed",
} as const satisfies Record<MediaListStatus, string>;

/** Inline status dropdown for adding a media item or changing its list status. */
export function MediaListMenu({ media, userId }: MediaListMenuProps) {
  const { t } = useTranslation(["common"]);
  const [open, setOpen] = useState(false);
  const actions = useMediaListActions(userId);
  const status = media.status;
  const visibleStatuses = statusOptions.filter((option) => option !== status);
  const isDisabled = !actions.canManageList || actions.isPending;

  const selectStatus = (nextStatus: MediaListStatus) => {
    actions.changeStatus(media.id, nextStatus);
    setOpen(false);
  };

  const removeFromList = () => {
    if (media.listEntryId !== null) {
      actions.removeFromList(media.listEntryId, media.id);
      setOpen(false);
    }
  };

  return (
    <div className={styles.root}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((current) => !current)}
        className={clsx(styles.trigger, styles.triggerTone[status ?? "none"], {
          [styles.triggerOpen]: !open,
        })}
      >
        <span className={styles.triggerText}>
          {status ? t(statusTranslationKey[status]) : t("common:mediaList.add")}
        </span>
        {status ? (
          <ArrowDownIcon
            className={clsx(styles.arrow, { [styles.arrowOpen]: open })}
          />
        ) : (
          <PlusIcon className={styles.addIcon} />
        )}
      </button>
      {open && (
        <div
          className={clsx(styles.options, styles.optionsTone[status ?? "none"])}
        >
          {visibleStatuses.map((option) => (
            <button
              key={option}
              type="button"
              disabled={isDisabled}
              onClick={() => selectStatus(option)}
              className={clsx(
                styles.option,
                styles.optionTone[status ?? "none"],
              )}
            >
              {t(statusTranslationKey[option])}
            </button>
          ))}

          {media.listEntryId !== null && (
            <button
              type="button"
              disabled={isDisabled}
              onClick={removeFromList}
              className={clsx(
                styles.remove,
                styles.removeTone[status ?? "none"],
              )}
            >
              {t("common:mediaList.remove")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
