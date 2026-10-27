import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { useRef, useEffect, useCallback } from "react";

import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";

import {
  useMediaListActions,
  MediaListContextMenu,
} from "@/features/manage-media-list";

import type { AccountProfile } from "@/entities/account";
import type { Media, MediaListStatus } from "@/entities/media";

import { NoImageIcon } from "@/shared/icons";
import { skeletonAnimation } from "@/shared/styles";
import {
  Image,
  Score,
  Title,
  Heading,
  Progress,
  type TitleState,
} from "@/shared/ui";

import { formatLabelKey } from "../media-detail-labels";
import { useMediaRecommendations } from "../../model/useMediaRecommendations";

import * as pageStyles from "../MediaDetailPage.css";
import * as styles from "./MediaRecommendations.css";

const titleVariantByStatus: Record<MediaListStatus, TitleState> = {
  PAUSED: "paused",
  DROPPED: "dropped",
  CURRENT: "watching",
  PLANNING: "planning",
  COMPLETED: "completed",
};

type MediaRecommendationsProps = {
  mediaId: number;
  userId: undefined | AccountProfile["id"];
};

export function MediaRecommendations({
  userId,
  mediaId,
}: MediaRecommendationsProps) {
  const { t } = useTranslation(["common"]);
  const recommendationsQuery = useMediaRecommendations({ userId, mediaId });
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
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
    if (!emblaApi) return;

    const fetchNextPageAtEnd = () => {
      const lastSnapIndex = emblaApi.scrollSnapList().length - 1;

      if (
        lastSnapIndex >= 0 &&
        emblaApi.selectedScrollSnap() >= lastSnapIndex
      ) {
        requestNextPage();
      }
    };

    emblaApi.on("select", fetchNextPageAtEnd);
    return () => {
      emblaApi.off("select", fetchNextPageAtEnd);
    };
  }, [emblaApi, requestNextPage]);

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
    <section className={pageStyles.section}>
      <Heading size="m" variant="neutral">
        {t("common:mediaDetail.recommendations")}
      </Heading>
      <div ref={viewportRef} className={styles.carouselViewport}>
        <div className={styles.carouselTrack}>
          {recommendationsQuery.isPending ? (
            <RecommendationsSkeleton />
          ) : (
            media.map((item) => (
              <div key={item.id} className={styles.recommendationSlide}>
                <MediaListContextMenu media={item} userId={userId}>
                  <LinkedMediaCard media={item} userId={userId} />
                </MediaListContextMenu>
              </div>
            ))
          )}
          {recommendationsQuery.isFetchingNextPage && (
            <div
              key="recommendation-loading"
              className={styles.recommendationSlide}
            >
              <RecommendationCardSkeleton />
            </div>
          )}
        </div>
      </div>
    </section>
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
  const location = useLocation();
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
      <Link
        to={`/media/${media.id}`}
        className={styles.recommendationLink}
        state={{ media, from: location.pathname }}
      />
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
        {media.status === "CURRENT" && media.progress !== null && (
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

function RecommendationsSkeleton() {
  return Array.from({ length: 3 }, (_, index) => (
    <div key={index} className={styles.recommendationSlide}>
      <RecommendationCardSkeleton />
    </div>
  ));
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
