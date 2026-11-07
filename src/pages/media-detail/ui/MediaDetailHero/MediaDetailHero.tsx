import { Link } from "react-router";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import {
  useMediaListActions,
  MediaListContextMenu,
} from "@/features/manage-media-list";

import type { Media, MediaListStatus } from "@/entities/media";

import { skeletonAnimation } from "@/shared/styles";
import {
  CopyIcon,
  ListIcon,
  HeartIcon,
  NoImageIcon,
  HeartFilledIcon,
} from "@/shared/icons";
import {
  Row,
  Chip,
  Image,
  Column,
  Rating,
  Button,
  BackLink,
  Progress,
  showNotification,
} from "@/shared/ui";

import * as styles from "./MediaDetailHero.css";

const titleMarkerByStatus: Record<MediaListStatus, string> = {
  PAUSED: styles.titleMarkerPaused,
  DROPPED: styles.titleMarkerDropped,
  CURRENT: styles.titleMarkerWatching,
  PLANNING: styles.titleMarkerPlanning,
  REPEATING: styles.titleMarkerRepeating,
  COMPLETED: styles.titleMarkerCompleted,
};

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
  const handleFavoriteToggle = () =>
    actions.toggleFavorite(media.id, !media.isFavorite);
  const handleCopyLink = async () => {
    try {
      await copyToClipboard(window.location.href);
      showNotification(t("common:notify.mediaLinkCopied"), "info");
    } catch {
      showNotification(t("common:notify.mediaLinkCopyFailed"), "error");
    }
  };
  const canContinue =
    (media.status === "CURRENT" || media.status === "REPEATING") &&
    (media.progress ?? 0) > 0;

  return (
    <Column gap="xs">
      <Column gap="m">
        <h1 className={styles.title}>
          {media.status && (
            <span
              className={clsx(
                styles.titleMarker,
                titleMarkerByStatus[media.status],
              )}
            />
          )}
          <span
            className={clsx(
              styles.titleText,
              media.status && styles.titleTextWithMarker,
            )}
          >
            {media.title}
          </span>
        </h1>
        <div style={previewStyle} className={styles.preview}>
          <MediaListContextMenu media={media} userId={userId}>
            <div className={styles.hero}>
              <div className={styles.posterFrame}>
                <Image
                  loading="eager"
                  className={styles.posterImage}
                  alt={coverUrl ? media.title : ""}
                  imageClassName={
                    coverUrl ? undefined : styles.posterPlaceholder
                  }
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
                <div
                  className={styles.actions}
                  onContextMenu={(event) => event.stopPropagation()}
                >
                  <MediaListContextMenu
                    media={media}
                    userId={userId}
                    triggerMode="click"
                  >
                    <Button round>
                      <ListIcon className={styles.actionIcon} />
                    </Button>
                  </MediaListContextMenu>
                  <Button
                    round
                    onClick={handleFavoriteToggle}
                    disabled={!actions.canManageList || actions.isPending}
                  >
                    {media.isFavorite ? (
                      <HeartFilledIcon
                        className={clsx(
                          styles.actionIcon,
                          styles.actionIconFavorite,
                        )}
                      />
                    ) : (
                      <HeartIcon className={styles.actionIcon} />
                    )}
                  </Button>
                  <Button round onClick={handleCopyLink}>
                    <CopyIcon className={styles.actionIcon} />
                  </Button>
                </div>
              </div>
            </div>
          </MediaListContextMenu>
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
      <Link
        className={styles.watchLink}
        to={`/media/${media.id}/watch`}
        aria-label={t(
          canContinue ? "common:watch.continue" : "common:watch.open",
        )}
      >
        <span className={styles.watchPlayIcon}>
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
        <span className={styles.watchArrow}>→</span>
      </Link>
    </Column>
  );
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();

  if (!copied) throw new Error("The link could not be copied.");
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
    </>
  );
}

export function MediaDetailBackLink() {
  const { t } = useTranslation(["common"]);

  return <BackLink>{t("common:mediaDetail.back")}</BackLink>;
}
