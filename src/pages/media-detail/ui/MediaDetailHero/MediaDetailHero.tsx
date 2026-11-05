import { Link } from "react-router";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import {
  MediaListMenu,
  useMediaListActions,
} from "@/features/manage-media-list";

import type { Media } from "@/entities/media";

import { NoImageIcon } from "@/shared/icons";
import { skeletonAnimation } from "@/shared/styles";
import {
  Row,
  Chip,
  Image,
  Column,
  Rating,
  BackLink,
  Progress,
} from "@/shared/ui";

import * as styles from "./MediaDetailHero.css";

export type MediaDetailHeroProps = {
  media: Media;
  userId: string | undefined;
};

export function MediaDetailHero({ media, userId }: MediaDetailHeroProps) {
  const { t } = useTranslation(["common"]);

  const actions = useMediaListActions(userId);
  const coverUrl = media.coverImage?.large ?? media.coverImage?.preview;
  const bannerUrl = media.bannerImage;
  const previewStyle = {
    "--banner-image": bannerUrl
      ? `url("${bannerUrl}")`
      : coverUrl
        ? `url("${coverUrl}")`
        : "none",
  } as CSSProperties;

  const handleScoreChange = (value: number) => {
    actions.updateScore(media.id, Math.round(value * 2) / 2);
  };

  const handleProgressChange = (value: number) => {
    actions.updateProgress(media.id, value);
  };
  const canContinue =
    (media.status === "CURRENT" || media.status === "REPEATING") &&
    (media.progress ?? 0) > 0;

  return (
    <Column gap="xs">
      <Column gap="m">
        <h1 className={styles.title}>{media.title}</h1>
        <div style={previewStyle} className={styles.preview}>
          <div className={styles.hero}>
            <div className={styles.posterFrame}>
              <Image
                loading="eager"
                className={styles.posterImage}
                alt={coverUrl ? media.title : ""}
                imageClassName={coverUrl ? undefined : styles.posterPlaceholder}
                image={{
                  url:
                    coverUrl ??
                    `${import.meta.env.BASE_URL}images/media-no-image.png`,
                }}
              />
              {!coverUrl && (
                <Chip
                  icon={<NoImageIcon />}
                  className={styles.noImageIcon}
                  label={t("mediaDetail.noImagelabel")}
                />
              )}
            </div>
          </div>
          <Row wide alignItem="center" className={styles.ratingBar}>
            <Row
              wide
              gap="xl"
              alignItem="center"
              justifyContent="space-between"
              className={styles.ratingBarContent}
            >
              <Row gap="xs" alignItem="center">
                <Rating
                  max={10}
                  size="s"
                  value={media.score ?? 0}
                  onChange={handleScoreChange}
                  className={clsx(actions.isPending && styles.ratingDisabled)}
                />
                <div className={styles.ratingValue}>
                  {(media.score ?? 0).toFixed(1)}
                </div>
              </Row>
              {(media.status === "CURRENT" || media.status === "REPEATING") &&
                media.progress !== null && (
                  <Progress
                    size="l"
                    value={media.progress}
                    max={media.episodes ?? 12}
                    className={styles.progress}
                    disabled={actions.isPending}
                    editable={actions.canManageList}
                    onValueChange={handleProgressChange}
                  />
                )}
            </Row>
          </Row>
        </div>
      </Column>
      <MediaListMenu media={media} userId={userId} />
      <Link
        className={styles.watchLink}
        to={`/media/${media.id}/watch`}
        aria-label={t(
          canContinue ? "common:watch.continue" : "common:watch.open",
        )}
      >
        <span aria-hidden="true" className={styles.watchPlayIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4.8v14.4L19 12 7 4.8Z" />
          </svg>
        </span>
        <span className={styles.watchText}>
          <span className={styles.watchTitle}>
            {t(canContinue ? "common:watch.continue" : "common:watch.open")}
          </span>
          {media.episodes !== null && (
            <span className={styles.watchEpisodes}>
              {t("common:watch.episodeCount", { count: media.episodes })}
            </span>
          )}
        </span>
        <span aria-hidden="true" className={styles.watchArrow}>
          →
        </span>
      </Link>
    </Column>
  );
}

export type MediaDetailHeroSkeletonProps = {
  title?: boolean;
};

export function MediaDetailHeroSkeleton({
  title = true,
}: MediaDetailHeroSkeletonProps) {
  return (
    <>
      {title && (
        <span className={clsx(styles.titleSkeleton, skeletonAnimation)} />
      )}
      <div className={styles.previewSkeleton}>
        <div className={styles.heroSkeleton}>
          <span className={clsx(styles.posterSkeleton, skeletonAnimation)} />
        </div>
        <div className={styles.ratingSkeleton}>
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={clsx(styles.starSkeleton, skeletonAnimation)}
            />
          ))}
          <span
            className={clsx(styles.ratingTextSkeleton, skeletonAnimation)}
          />
        </div>
      </div>
      <span className={clsx(styles.menuSkeleton, skeletonAnimation)} />
    </>
  );
}

export function MediaDetailBackLink() {
  const { t } = useTranslation(["common"]);

  return <BackLink>{t("common:mediaDetail.back")}</BackLink>;
}
