import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { NoImageIcon } from "@/shared/icons";
import type { TitleState } from "@/shared/ui";
import { Image, Score, Title } from "@/shared/ui";
import { skeletonAnimation } from "@/shared/styles";

import type { Media, MediaListStatus } from "../../model/media";
import { MediaDetailLink } from "../MediaDetailLink/MediaDetailLink";
import {
  MediaReleaseStatus,
  getMediaReleaseStatusInfo,
} from "../MediaReleaseStatus";

import * as styles from "./CompactCard.css";

export type CompactCardProps = {
  media: Media;
  className?: string;
  relationLabel?: string;
};

export type CompactCardSkeletonProps = {
  className?: string;
};

const titleVariantByStatus: Record<MediaListStatus, TitleState> = {
  PAUSED: "paused",
  DROPPED: "dropped",
  CURRENT: "watching",
  PLANNING: "planning",
  COMPLETED: "completed",
};

export function CompactCard({
  media,
  className,
  relationLabel,
}: CompactCardProps) {
  const { t } = useTranslation(["common"]);
  const imageUrl = media.coverImage?.large ?? media.coverImage?.preview;
  const isPlaceholder = !imageUrl;
  const statusInfo = getMediaReleaseStatusInfo(media.releaseStatus);
  const format = media.format
    ? formatTranslationKey[media.format as keyof typeof formatTranslationKey]
      ? t(
          formatTranslationKey[
            media.format as keyof typeof formatTranslationKey
          ],
        )
      : media.format
    : "";
  const hasFormat = Boolean(format);
  const hasYear = media.seasonYear !== null;
  const hasReleaseStatus = statusInfo !== null;

  return (
    <MediaDetailLink media={media} className={clsx(styles.root, className)}>
      <div className={styles.cover}>
        <Image
          loading="lazy"
          alt={isPlaceholder ? "" : media.title}
          imageClassName={isPlaceholder ? styles.placeholderImage : undefined}
          image={{
            url:
              imageUrl ??
              `${import.meta.env.BASE_URL}images/media-no-image.png`,
          }}
        />
        {isPlaceholder && <NoImageIcon className={styles.noImageIcon} />}
      </div>
      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <div className={styles.header}>
            <span className={styles.relationName}>{relationLabel}</span>
            {media.averageScore !== null && (
              <Score size="s" shadow={false} value={media.averageScore / 10} />
            )}
          </div>
          <Title
            title={media.title}
            className={styles.title}
            variant={
              media.status ? titleVariantByStatus[media.status] : "default"
            }
          />
        </div>
        <div className={styles.footer}>
          <div className={styles.meta}>
            {hasFormat && <span>{format}</span>}
            {hasFormat && hasYear && <span className={styles.separator} />}
            {hasYear && <span>{media.seasonYear}</span>}
            {hasReleaseStatus && (hasFormat || hasYear) && (
              <span className={styles.separator} />
            )}
            {hasReleaseStatus && (
              <MediaReleaseStatus
                size="s"
                className={styles.status}
                releaseStatus={media.releaseStatus}
              />
            )}
          </div>
        </div>
      </div>
    </MediaDetailLink>
  );
}

export function CompactCardSkeleton({ className }: CompactCardSkeletonProps) {
  return (
    <div className={clsx(styles.root, className)}>
      <div
        className={clsx(styles.cover, styles.skeletonCover, skeletonAnimation)}
      />
      <div className={styles.skeletonContent}>
        <span className={clsx(styles.skeletonHeader, skeletonAnimation)} />
        <span className={clsx(styles.skeletonTitle, skeletonAnimation)} />
        <span className={clsx(styles.skeletonFooter, skeletonAnimation)} />
      </div>
    </div>
  );
}

const formatTranslationKey = {
  TV: "common:ui.filters.mediaFormat.tv",
  OVA: "common:ui.filters.mediaFormat.ova",
  ONA: "common:ui.filters.mediaFormat.ona",
  MOVIE: "common:ui.filters.mediaFormat.movie",
  MUSIC: "common:ui.filters.mediaFormat.music",
  SPECIAL: "common:ui.filters.mediaFormat.special",
  TV_SHORT: "common:ui.filters.mediaFormat.tvShort",
} as const;
