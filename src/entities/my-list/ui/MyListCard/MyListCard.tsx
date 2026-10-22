import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { NoImageIcon } from "@/shared/icons";
import { skeletonAnimation } from "@/shared/styles";
import { Image, Score, Title, Column, Progress } from "@/shared/ui";

import type { MyListEntry } from "../../model/my-list";

import * as styles from "./MyListCard.css";

export type MyListCardProps = {
  size?: "l" | "s";
  entry?: MyListEntry;
  showActions?: boolean;
  variant?: "default" | "placeholder";
};

export type MyListCardSkeletonProps = {
  size?: "l" | "s";
};

export function MyListCardSkeleton({ size = "l" }: MyListCardSkeletonProps) {
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

export function MyListCard({
  entry,
  size = "l",
  showActions = false,
  variant = "default",
}: MyListCardProps) {
  const { t } = useTranslation(["common"]);
  const coverUrl = entry?.coverImage?.large ?? entry?.coverImage?.preview;
  const isPlaceholder = variant === "placeholder" || !coverUrl;
  const scoreSize = size === "l" ? "m" : "s";
  const progressSize = size === "l" ? "m" : "s";
  const displayScore = entry?.averageScore;
  const formatLabel =
    entry?.format === "TV" ? t("common:tvSeries") : entry?.format;

  return (
    <article className={clsx(styles.root)}>
      <Column gap="xxs">
        <div>
          <div className={styles.cover[size]}>
            <Image
              className={styles.image}
              loading={isPlaceholder ? "eager" : "lazy"}
              alt={isPlaceholder ? "" : (entry?.title ?? "")}
              imageClassName={
                isPlaceholder ? styles.placeholderImage : undefined
              }
              preview={
                !isPlaceholder && entry?.coverImage?.preview
                  ? { url: entry.coverImage.preview }
                  : undefined
              }
              image={{
                url: isPlaceholder
                  ? "/images/anime-no-image.png"
                  : (entry?.coverImage?.large ?? coverUrl ?? ""),
              }}
            />
            {displayScore !== null && displayScore !== undefined && (
              <Score
                size={scoreSize}
                className={styles.score}
                value={displayScore / 10}
              />
            )}
            {isPlaceholder && <NoImageIcon className={styles.noImageIcon} />}
            {showActions && entry && (
              <Progress
                editable
                size={progressSize}
                max={entry.episodes ?? 12}
                className={styles.progress}
                defaultValue={entry.progress ?? 0}
              />
            )}
          </div>
        </div>
        <Title title={entry?.title ?? ""} />
      </Column>
      <div className={styles.metadata}>
        <span>{formatLabel}</span>
        <span>{entry?.seasonYear}</span>
      </div>
    </article>
  );
}
