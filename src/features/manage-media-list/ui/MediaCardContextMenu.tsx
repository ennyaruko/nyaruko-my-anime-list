import { useTranslation } from "react-i18next";
import { useRef, useState, cloneElement, isValidElement } from "react";
import type {
  SVGProps,
  ReactNode,
  ReactElement,
  ComponentType,
  MouseEventHandler,
} from "react";

import type { Media, MediaListStatus } from "@/entities/media";
import {
  MediaCard,
  MediaDetailLink,
  MediaContextInformation,
} from "@/entities/media";

import {
  ViewIcon,
  InfoIcon,
  DeleteIcon,
  PausedIcon,
  RepeatIcon,
  DroppedIcon,
  WatchedIcon,
  PlanningIcon,
} from "@/shared/icons";
import {
  ContextMenu,
  ContextMenuSub,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/shared/ui";

import { useMediaListActions } from "../model/useMediaListActions";

import * as styles from "./MediaCardContextMenu.css";

type StatusIcon = ComponentType<SVGProps<SVGSVGElement>>;

// Tune the anime information panel width here; the same value applies on desktop and mobile.
const mediaInfoExtraWidth = 40;

type StatusTranslationKey =
  | "common:ui.watchStatus.paused"
  | "common:ui.watchStatus.dropped"
  | "common:ui.watchStatus.planned"
  | "common:ui.watchStatus.watching"
  | "common:ui.watchStatus.repeating"
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
    Icon: PlanningIcon,
    status: "PLANNING",
    translationKey: "common:ui.watchStatus.planned",
  },
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
    Icon: RepeatIcon,
    status: "REPEATING",
    translationKey: "common:ui.watchStatus.repeating",
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
];

export type MediaListContextMenuProps = {
  media: Media;
  children: ReactNode;
  userId: string | undefined;
  triggerMode?: "click" | "context";
  onAddToWatch?: (media: Media) => void;
};

export type MediaCardContextMenuProps = {
  media: Media;
  size?: "l" | "s";
  userId: string | undefined;
  onAddToWatch?: (media: Media) => void;
};

/** Context actions shared by media presentations on list, search, and detail. */
export function MediaListContextMenu({
  media,
  userId,
  children,
  onAddToWatch,
  triggerMode = "context",
}: MediaListContextMenuProps) {
  const { t } = useTranslation(["common"]);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [mobileInfoWidth, setMobileInfoWidth] = useState<number>();
  const contentRef = useRef<HTMLDivElement>(null);
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
  const trigger =
    triggerMode === "click" && isValidElement(children) ? (
      cloneElement(
        children as ReactElement<{
          onClick?: MouseEventHandler<HTMLButtonElement>;
        }>,
        {
          onClick: (event) => {
            const childOnClick = (
              children as ReactElement<{
                onClick?: MouseEventHandler<HTMLButtonElement>;
              }>
            ).props.onClick;
            childOnClick?.(event);

            if (event.defaultPrevented) return;

            event.currentTarget.dispatchEvent(
              new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: true,
                clientX: event.clientX,
                clientY: event.clientY,
              }),
            );
          },
        },
      )
    ) : (
      <div className={styles.trigger}>{children}</div>
    );

  const changeStatus = (status: MediaListStatus) => {
    actions.changeStatus(media.id, status);
  };

  const removeFromList = () => {
    if (media.listEntryId !== null) {
      actions.removeFromList(media.listEntryId, media.id);
    }
  };

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (!open) setShowMobileInfo(false);
      }}
    >
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent
        ref={contentRef}
        collisionPadding={8}
        style={
          showMobileInfo && mobileInfoWidth
            ? { width: mobileInfoWidth + mediaInfoExtraWidth }
            : undefined
        }
      >
        {showMobileInfo ? (
          <MediaContextInformation
            showBack
            media={media}
            onBack={() => setShowMobileInfo(false)}
          />
        ) : (
          <>
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
            <ContextMenuSeparator />
            {onAddToWatch && (
              <ContextMenuItem onSelect={() => onAddToWatch(media)}>
                <PlanningIcon className={styles.icon} />
                <span>{t("common:contextMenu.addToWatch")}</span>
              </ContextMenuItem>
            )}
            <ContextMenuItem
              className={styles.mobileInfoItem}
              onSelect={(event) => {
                event.preventDefault();
                const menuWidth =
                  contentRef.current?.getBoundingClientRect().width;
                if (menuWidth) setMobileInfoWidth(menuWidth);
                setShowMobileInfo(true);
              }}
            >
              <InfoIcon className={styles.icon} />
              <span>{t("common:contextMenu.mediaInfo")}</span>
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger className={styles.desktopInfoItem}>
                <InfoIcon className={styles.icon} />
                <span>{t("common:contextMenu.mediaInfo")}</span>
                <span aria-hidden="true" className={styles.submenuArrow}>
                  ›
                </span>
              </ContextMenuSubTrigger>
              <ContextMenuSubContent
                align="start"
                sideOffset={10}
                style={{
                  width: `calc(var(--radix-context-menu-trigger-width) + ${mediaInfoExtraWidth}px + 16px)`,
                }}
              >
                <MediaContextInformation media={media} />
              </ContextMenuSubContent>
            </ContextMenuSub>
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
  onAddToWatch,
}: MediaCardContextMenuProps) {
  const actions = useMediaListActions(userId);

  return (
    <MediaListContextMenu
      media={media}
      userId={userId}
      onAddToWatch={onAddToWatch}
    >
      <div className={styles.cardSurface}>
        <MediaDetailLink
          media={media}
          aria-label={media.title}
          className={styles.mediaLink}
        />
        <MediaCard
          size={size}
          media={media}
          progressUpdating={actions.isPending}
          onProgressChange={(progress) =>
            actions.updateProgress(media.id, progress)
          }
          editableProgress={
            (media.status === "CURRENT" || media.status === "REPEATING") &&
            actions.canManageList
          }
        />
      </div>
    </MediaListContextMenu>
  );
}
