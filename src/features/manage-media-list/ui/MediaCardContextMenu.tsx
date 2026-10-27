import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import type { SVGProps, ReactNode, ComponentType } from "react";

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

type StatusTranslationKey =
  | "common:ui.watchStatus.paused"
  | "common:ui.watchStatus.dropped"
  | "common:ui.watchStatus.planned"
  | "common:ui.watchStatus.watching"
  | "common:ui.watchStatus.completed";

type StatusAction = {
  label: string;
  Icon: StatusIcon;
  status: MediaListStatus;
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
    Icon: DroppedIcon,
    status: "DROPPED",
    translationKey: "common:ui.watchStatus.dropped",
  },
  {
    Icon: PausedIcon,
    status: "PAUSED",
    translationKey: "common:ui.watchStatus.paused",
  },
  {
    Icon: PlanningIcon,
    status: "PLANNING",
    translationKey: "common:ui.watchStatus.planned",
  },
];

export type MediaListContextMenuProps = {
  media: Media;
  children: ReactNode;
  userId: string | undefined;
};

export type MediaCardContextMenuProps = {
  media: Media;
  size?: "l" | "s";
  userId: string | undefined;
};

/** Context actions shared by media presentations on list, search, and detail. */
export function MediaListContextMenu({
  media,
  userId,
  children,
}: MediaListContextMenuProps) {
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
  const canRemove = hasListEntry && actions.canManageList;

  const changeStatus = (status: MediaListStatus) => {
    actions.changeStatus(media.id, status);
  };

  const removeFromList = () => {
    if (media.listEntryId !== null) {
      actions.removeFromList(media.listEntryId, media.id);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className={styles.trigger}>{children}</div>
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
        {canRemove && (
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

/** Clickable card that opens the internal detail route and shares list actions. */
export function MediaCardContextMenu({
  media,
  userId,
  size = "l",
}: MediaCardContextMenuProps) {
  const location = useLocation();
  const actions = useMediaListActions(userId);

  return (
    <MediaListContextMenu media={media} userId={userId}>
      <div className={styles.cardSurface}>
        <Link
          aria-label={media.title}
          to={`/media/${media.id}`}
          className={styles.mediaLink}
          state={{ media, from: location.pathname }}
        />
        <MediaCard
          size={size}
          media={media}
          progressUpdating={actions.isPending}
          editableProgress={media.status === "CURRENT" && actions.canManageList}
          onProgressChange={(progress) =>
            actions.updateProgress(media.id, progress)
          }
        />
      </div>
    </MediaListContextMenu>
  );
}
