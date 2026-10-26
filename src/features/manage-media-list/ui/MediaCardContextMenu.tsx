import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { SVGProps, ComponentType } from "react";

import { MediaCard } from "@/entities/media";
import type { Media, MediaListStatus } from "@/entities/media";

import {
  ViewIcon,
  DeleteIcon,
  PausedIcon,
  DroppedIcon,
  WatchedIcon,
  PlanningIcon,
} from "@/shared/icons";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/shared/ui";

import { useMediaListActions } from "../model/useMediaListActions";

import * as styles from "./MediaCardContextMenu.css";

type StatusIcon = ComponentType<SVGProps<SVGSVGElement>>;

type StatusAction = {
  label: string;
  Icon: StatusIcon;
  status: MediaListStatus;
};

type StatusTranslationKey =
  | "common:ui.watchStatus.paused"
  | "common:ui.watchStatus.dropped"
  | "common:ui.watchStatus.planned"
  | "common:ui.watchStatus.watching"
  | "common:ui.watchStatus.completed";

export type MediaCardContextMenuProps = {
  media: Media;
  size?: "l" | "s";
  userId: string | undefined;
};

const availableStatuses: Array<{
  Icon: StatusIcon;
  status: MediaListStatus;
  translationKey: StatusTranslationKey;
}> = [
  {
    Icon: ViewIcon,
    status: "CURRENT",
    translationKey: "common:ui.watchStatus.watching",
  },
  {
    Icon: WatchedIcon,
    status: "COMPLETED",
    translationKey: "common:ui.watchStatus.completed",
  },
  {
    status: "DROPPED",
    Icon: DroppedIcon,
    translationKey: "common:ui.watchStatus.dropped",
  },
  {
    status: "PAUSED",
    Icon: PausedIcon,
    translationKey: "common:ui.watchStatus.paused",
  },
  {
    status: "PLANNING",
    Icon: PlanningIcon,
    translationKey: "common:ui.watchStatus.planned",
  },
];

export function MediaCardContextMenu({
  media,
  userId,
  size = "l",
}: MediaCardContextMenuProps) {
  const { t } = useTranslation(["common"]);
  const actions = useMediaListActions(userId);

  const statusActions: StatusAction[] = availableStatuses
    .filter(({ status }) => media.status !== status)
    .map(({ Icon, status, translationKey }) => ({
      Icon,
      status,
      label: t(translationKey),
    }));
  const hasListEntry = media.listEntryId !== null;

  const changeStatus = (status: MediaListStatus) => {
    actions.changeStatus(media.id, status);
  };

  const removeFromList = () => {
    if (media.listEntryId !== null) {
      actions.removeFromList(media.listEntryId);
    }
  };

  const updateProgress = (progress: number) => {
    actions.updateProgress(media.id, progress);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className={styles.trigger}>
          <Link
            target="_blank"
            aria-label={media.title}
            rel="noopener noreferrer"
            className={styles.mediaLink}
            to={`https://anilist.co/anime/${media.id}`}
          />
          <MediaCard
            size={size}
            media={media}
            onProgressChange={updateProgress}
            progressUpdating={actions.isPending}
            editableProgress={
              media.status === "CURRENT" && actions.canManageList
            }
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent collisionPadding={8}>
        {statusActions.map(({ Icon, label, status }) => (
          <ContextMenuItem
            key={status}
            onSelect={() => changeStatus(status)}
            disabled={!actions.canManageList || actions.isPending}
          >
            <Icon className={styles.icon} />
            <span>{label}</span>
          </ContextMenuItem>
        ))}
        {hasListEntry && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              tone="destructive"
              onSelect={removeFromList}
              disabled={!actions.canManageList || actions.isPending}
            >
              <DeleteIcon className={styles.icon} />
              <span>{t("common:mediaList.remove")}</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
