import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useRef, useEffect, useCallback } from "react";

import clsx from "clsx";

import { MediaCarousel } from "@/widgets/media-carousel";

import { useMediaRecommendations } from "@/features/media-recommendations";
import {
  useMediaListActions,
  MediaListContextMenu,
} from "@/features/manage-media-list";

import { MediaDetailLink } from "@/entities/media";
import type { AccountProfile } from "@/entities/account";
import type { Media, MediaListStatus } from "@/entities/media";

import { NoImageIcon } from "@/shared/icons";
import { skeletonAnimation } from "@/shared/styles";
import { Image, Score, Title, Progress, type TitleState } from "@/shared/ui";

import { formatLabelKey } from "../media-detail-labels";

import * as styles from "./MediaRecommendations.css";

const titleVariantByStatus: Record<MediaListStatus, TitleState> = {
  PAUSED: "paused",
  DROPPED: "dropped",
  CURRENT: "watching",
  PLANNING: "planning",
  REPEATING: "repeating",
  COMPLETED: "completed",
};

type MediaRecommendationsProps = {
  mediaId: number;
  isAdultMode: boolean;
  userId: undefined | AccountProfile["id"];
};

export function MediaRecommendations({
  userId,
  mediaId,
  isAdultMode,
}: MediaRecommendationsProps) {
  const { t } = useTranslation(["common"]);
  const recommendationsQuery = useMediaRecommendations({
    userId,
    mediaId,
    isAdultMode,
  });
  const isFetchingMore = useRef(false);
  const { hasNextPage, fetchNextPage, isFetchingNextPage } =
    recommendationsQuery;
  const requestNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isFetchingMore.current) return;

    isFetchingMore.current = true;
    void fetchNextPage().finally(() => {
      isFetchingMore.current = false;
    });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const pages = recommendationsQuery.data?.pages ?? [];
    const lastPage = pages.at(-1);
    const previousIds = new Set(
      pages.slice(0, -1).flatMap((page) => page.items.map(({ id }) => id)),
    );
    const lastPageHasNewItems = lastPage?.items.some(
      ({ id }) => !previousIds.has(id),
    );

    if (lastPage && !lastPageHasNewItems && hasNextPage) requestNextPage();
  }, [hasNextPage, recommendationsQuery.data, requestNextPage]);

  if (recommendationsQuery.isError && !recommendationsQuery.data) return null;

  const items =
    recommendationsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const media = [...new Map(items.map((item) => [item.id, item])).values()];

  if (!recommendationsQuery.isPending && media.length === 0) return null;

  return (
    <MediaCarousel
      items={media}
      getKey={(item) => item.id}
      onFetchNextPage={requestNextPage}
      hasNextPage={hasNextPage ?? false}
      isFetchingNextPage={isFetchingNextPage}
      isPending={recommendationsQuery.isPending}
      title={t("common:mediaDetail.recommendations")}
      renderSkeleton={() => <RecommendationCardSkeleton />}
      renderItem={(item) => (
        <MediaListContextMenu media={item} userId={userId}>
          <LinkedMediaCard media={item} userId={userId} />
        </MediaListContextMenu>
      )}
      titleAction={
        <Link
          to={`/media/${mediaId}/recommendations`}
          className={styles.allRecommendationsLink}
        >
          {t("common:mediaDetail.allRecommendations")}
        </Link>
      }
    />
  );
}

function LinkedMediaCard({
  media,
  userId,
}: {
  media: Media;
  userId: string | undefined;
}) {
  const { t } = useTranslation(["common"]);
  const actions = useMediaListActions(userId);
  const titleVariant = media.status
    ? titleVariantByStatus[media.status]
    : "default";
  const imageUrl = media.coverImage?.large ?? media.coverImage?.preview;
  const formatKey = media.format
    ? formatLabelKey[media.format as keyof typeof formatLabelKey]
    : undefined;

  return (
    <div className={styles.recommendationCard}>
      <MediaDetailLink media={media} className={styles.recommendationLink} />
      <div className={styles.recommendationCover}>
        <Image
          loading="lazy"
          alt={imageUrl ? media.title : ""}
          imageClassName={
            imageUrl ? undefined : styles.recommendationPlaceholder
          }
          image={{
            url:
              imageUrl ??
              `${import.meta.env.BASE_URL}images/media-no-image.png`,
          }}
        />
        {media.averageScore !== null && (
          <Score
            size="s"
            value={media.averageScore / 10}
            className={styles.recommendationScore}
          />
        )}
        {!imageUrl && <NoImageIcon className={styles.noImageIcon} />}
        {(media.status === "CURRENT" || media.status === "REPEATING") &&
          media.progress !== null && (
            <Progress
              size="s"
              value={media.progress}
              max={media.episodes ?? 12}
              disabled={actions.isPending}
              editable={actions.canManageList}
              className={styles.recommendationProgress}
              onValueChange={(progress) =>
                actions.updateProgress(media.id, progress)
              }
            />
          )}
      </div>
      <Title
        title={media.title}
        variant={titleVariant}
        className={styles.recommendationTitle}
      />
      <div className={styles.recommendationMeta}>
        <span>{formatKey ? t(formatKey) : media.format}</span>
        {media.seasonYear && <span>{media.seasonYear}</span>}
      </div>
    </div>
  );
}

function RecommendationCardSkeleton() {
  return (
    <div className={styles.recommendationCard}>
      <div
        className={clsx(styles.recommendationCoverSkeleton, skeletonAnimation)}
      />
      <span
        className={clsx(styles.recommendationTitleSkeleton, skeletonAnimation)}
      />
      <span
        className={clsx(styles.recommendationMetaSkeleton, skeletonAnimation)}
      />
    </div>
  );
}
