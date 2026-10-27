import { Link } from "react-router";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import {
  MediaListMenu,
  useMediaListActions,
} from "@/features/manage-media-list";

import type { Media } from "@/entities/media";

import { skeletonAnimation } from "@/shared/styles";
import { NoImageIcon, ArrowDownIcon } from "@/shared/icons";
import { Row, Chip, Image, Column, Rating, Progress } from "@/shared/ui";

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
          <Row
            gap="xl"
            alignItem="center"
            className={styles.ratingBar}
            justifyContent="space-between"
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
            {media.status === "CURRENT" && media.progress !== null && (
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
        </div>
      </Column>
      <MediaListMenu media={media} userId={userId} />
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

export type MediaDetailBackLinkProps = {
  to: string;
};

export function MediaDetailBackLink({ to }: MediaDetailBackLinkProps) {
  const { t } = useTranslation(["common"]);

  return (
    <Link to={to} className={styles.backButton}>
      <ArrowDownIcon className={styles.backIcon} />
      {t("common:mediaDetail.back")}
    </Link>
  );
}
