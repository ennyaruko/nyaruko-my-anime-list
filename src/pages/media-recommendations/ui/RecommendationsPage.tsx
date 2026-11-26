import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { useAdultContent } from "@/features/toggle-adult-content";
import { MediaCardContextMenu } from "@/features/manage-media-list";
import { useMediaRecommendations } from "@/features/media-recommendations";

import { MediaCardSkeleton } from "@/entities/media";
import type { AccountProfile } from "@/entities/account";
import type {
  MediaContentMode,
  MediaRecommendationSort,
} from "@/entities/media";

import {
  Row,
  Column,
  Header,
  Heading,
  GridList,
  BackLink,
  Container,
  LabeledCheckbox,
  LabeledCombobox,
  BlockStatusEmpty,
  QueryErrorBoundary,
  BlockStatusNotFound,
} from "@/shared/ui";

import * as styles from "./RecommendationsPage.css";

const DEFAULT_SORT: MediaRecommendationSort = "ratingDesc";
const RECOMMENDATION_SORTS: MediaRecommendationSort[] = [
  "ratingDesc",
  "rating",
];

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
        <Heading variant="neutral">{t("common:mediaDetail.similar")}</Heading>
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
  const { t } = useTranslation(["common"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParameter = searchParams.get("sort");
  const sort: MediaRecommendationSort = RECOMMENDATION_SORTS.includes(
    sortParameter as MediaRecommendationSort,
  )
    ? (sortParameter as MediaRecommendationSort)
    : DEFAULT_SORT;
  const excludeListed = searchParams.get("excludeListed") === "1";
  const query = useMediaRecommendations({
    sort,
    userId,
    mediaId,
    perPage: 50,
    contentMode,
    excludeListed,
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
  const updateSearchParam = (key: string, value: null | string) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        if (value === null) nextParams.delete(key);
        else nextParams.set(key, value);
        return nextParams;
      },
      { replace: true, preventScrollReset: true },
    );
  };

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
  const toolbar = (
    <Row
      gap="m"
      alignItem="center"
      justifyContent="end"
      className={styles.toolbar}
    >
      <LabeledCombobox
        value={sort}
        className={styles.sort}
        label={t("common:sortLabel")}
        onValueChange={(value) => updateSearchParam("sort", value)}
        options={RECOMMENDATION_SORTS.map((value) => ({
          value,
          label: t(`common:recommendationSort.${value}`),
        }))}
      />
      <LabeledCheckbox
        size="s"
        checked={excludeListed}
        className={styles.excludeListedToggle}
        label={t("common:listRecommendations.excludeListed")}
        onCheckedChange={(checked) =>
          updateSearchParam("excludeListed", checked ? "1" : null)
        }
      />
    </Row>
  );

  if (isPending || (media.length === 0 && isFetchingNextPage)) {
    return (
      <Column gap="m">
        {toolbar}
        <GridList
          renderItem={() => <MediaCardSkeleton size="l" />}
          data={Array.from({ length: 6 }, (_, index) => index)}
        />
      </Column>
    );
  }

  if (media.length === 0) {
    return (
      <Column gap="m">
        {toolbar}
        <BlockStatusEmpty className={styles.empty} />
      </Column>
    );
  }

  return (
    <Column gap="m">
      {toolbar}
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
    </Column>
  );
}
