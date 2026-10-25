import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { NoImageIcon } from "@/shared/icons";
import { skeletonAnimation } from "@/shared/styles";
import {
  Image,
  Score,
  Title,
  Column,
  Progress,
  type TitleState,
} from "@/shared/ui";

import type { Media, MediaListStatus } from "../../model/media";

import * as styles from "./MediaCard.css";

export type MediaCardProps = {
  media: Media;
  size?: "l" | "s";
  editableProgress?: boolean;
};

export type MediaCardSkeletonProps = { size?: "l" | "s" };

const titleVariantByStatus: Record<MediaListStatus, TitleState> = {
  PAUSED: "paused",
  DROPPED: "dropped",
  CURRENT: "watching",
  PLANNING: "planning",
  COMPLETED: "completed",
};

export function MediaCardSkeleton({ size = "l" }: MediaCardSkeletonProps) {
  return (
    <article className={styles.root}>
      <Column gap="xxs">
        <div className={clsx(styles.skeletonCover[size], skeletonAnimation)}>
          <span
            className={clsx(styles.skeletonScore[size], skeletonAnimation)}
          />
        </div>
        <span className={clsx(styles.skeletonTitle, skeletonAnimation)} />
      </Column>
      <div className={styles.skeletonMeta}>
        <span className={clsx(styles.skeletonMetaValue, skeletonAnimation)} />
        <span className={clsx(styles.skeletonMetaValue, skeletonAnimation)} />
      </div>
    </article>
  );
}

export function MediaCard({
  media,
  size = "l",
  editableProgress = false,
}: MediaCardProps) {
  const { t } = useTranslation(["common"]);
  const coverUrl = media.coverImage?.large ?? media.coverImage?.preview;
  const isPlaceholder = !coverUrl;
  const formatLabel =
    media.format === "TV" ? t("common:tvSeries") : media.format;

  return (
    <article className={styles.root}>
      <Column gap="xxs">
        <div>
          <div className={styles.cover[size]}>
            <Image
              className={styles.image}
              alt={isPlaceholder ? "" : media.title}
              loading={isPlaceholder ? "eager" : "lazy"}
              imageClassName={
                isPlaceholder ? styles.placeholderImage : undefined
              }
              preview={
                !isPlaceholder && media.coverImage?.preview
                  ? { url: media.coverImage.preview }
                  : undefined
              }
              image={{
                url: isPlaceholder
                  ? "/images/media-no-image.png"
                  : (media.coverImage?.large ?? coverUrl ?? ""),
              }}
            />
            {media.averageScore !== null && (
              <Score
                className={styles.score}
                size={size === "l" ? "m" : "s"}
                value={media.averageScore / 10}
              />
            )}
            {isPlaceholder && <NoImageIcon className={styles.noImageIcon} />}
            {media.status === "CURRENT" && media.progress !== null && (
              <Progress
                max={media.episodes ?? 12}
                editable={editableProgress}
                className={styles.progress}
                defaultValue={media.progress}
                size={size === "l" ? "m" : "s"}
              />
            )}
          </div>
        </div>
        <Title
          title={media.title}
          variant={
            media.status ? titleVariantByStatus[media.status] : "default"
          }
        />
      </Column>
      <div className={styles.metadata}>
        <span>{formatLabel}</span>
        <span>{media.seasonYear}</span>
      </div>
    </article>
  );
}
