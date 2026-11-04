import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAdultContent } from "@/features/toggle-adult-content";
import { MediaCardContextMenu } from "@/features/manage-media-list";
import { useMediaRecommendations } from "@/features/media-recommendations";

import { MediaCardSkeleton } from "@/entities/media";
import type { AccountProfile } from "@/entities/account";
import type { MediaContentMode } from "@/entities/media";

import {
  Column,
  Header,
  GridList,
  BackLink,
  Container,
  BlockStatusEmpty,
  QueryErrorBoundary,
  BlockStatusNotFound,
} from "@/shared/ui";

import * as styles from "./RecommendationsPage.css";

type RecommendationsPageProps = {
  mediaId: number;
  userId: undefined | AccountProfile["id"];
};

export function RecommendationsPage({
  userId,
  mediaId,
}: RecommendationsPageProps) {
  const { t } = useTranslation(["common"]);
  const { mode: contentMode } = useAdultContent();

  if (!Number.isFinite(mediaId) || mediaId <= 0) {
    return <BlockStatusNotFound className={styles.notFound} />;
  }

  return (
    <Container as="main" className={styles.page}>
      <Column gap="m">
        <Header
          variant="plain"
          leading={<BackLink>{t("common:mediaDetail.back")}</BackLink>}
        />
        <QueryErrorBoundary resetKeys={[mediaId]}>
          <RecommendationsResults
            userId={userId}
            mediaId={mediaId}
            contentMode={contentMode}
          />
        </QueryErrorBoundary>
      </Column>
    </Container>
  );
}

type RecommendationsResultsProps = RecommendationsPageProps & {
  contentMode: MediaContentMode;
};

export function RecommendationsResults({
  userId,
  mediaId,
  contentMode,
}: RecommendationsResultsProps) {
  const query = useMediaRecommendations({
    userId,
    mediaId,
    perPage: 50,
    contentMode,
  });
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    query;
  const items = data?.pages.flatMap(({ items: pageItems }) => pageItems) ?? [];
  const media = [...new Map(items.map((item) => [item.id, item])).values()];
  const pages = data?.pages ?? [];
  const lastPage = pages.at(-1);
  const previousIds = new Set(
    pages.slice(0, -1).flatMap((page) => page.items.map(({ id }) => id)),
  );
  const lastPageHasNewItems = lastPage?.items.some(
    ({ id }) => !previousIds.has(id),
  );

  useEffect(() => {
    if (
      lastPage &&
      !lastPageHasNewItems &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [
    lastPage,
    lastPageHasNewItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);
  const footer = isFetchingNextPage ? (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: 6 }, (_, index) => (
        <MediaCardSkeleton size="l" key={index} />
      ))}
    </div>
  ) : null;

  if (isPending || (media.length === 0 && isFetchingNextPage)) {
    return (
      <GridList
        renderItem={() => <MediaCardSkeleton size="l" />}
        data={Array.from({ length: 6 }, (_, index) => index)}
      />
    );
  }

  if (media.length === 0) {
    return <BlockStatusEmpty className={styles.empty} />;
  }

  return (
    <GridList
      virtualize
      data={media}
      footer={footer}
      getKey={(item) => item.id}
      renderItem={(item) => (
        <MediaCardContextMenu size="l" media={item} userId={userId} />
      )}
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      }}
    />
  );
}
