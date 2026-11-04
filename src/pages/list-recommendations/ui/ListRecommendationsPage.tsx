import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAdultContent } from "@/features/toggle-adult-content";
import { MediaCardContextMenu } from "@/features/manage-media-list";
import { useListRecommendations } from "@/features/media-recommendations";

import { MediaCardSkeleton } from "@/entities/media";
import type { AccountState } from "@/entities/account";
import type { MediaRecommendationSort } from "@/entities/media";

import { NoContentIcon } from "@/shared/icons";
import {
  Row,
  Column,
  Heading,
  GridList,
  Container,
  Breadcrumbs,
  BlockStatusBase,
  LabeledCombobox,
  ScrollToTopButton,
  QueryErrorBoundary,
} from "@/shared/ui";

import * as styles from "./ListRecommendationsPage.css";

const DEFAULT_SORT: MediaRecommendationSort = "ratingDesc";
const SKELETON_ITEMS = Array.from({ length: 6 }, (_, index) => index);
const RECOMMENDATION_SORTS: MediaRecommendationSort[] = [
  "ratingDesc",
  "rating",
];

export function ListRecommendationsPage(accountState: AccountState) {
  const { t } = useTranslation(["common"]);

  return (
    <Container as="main" className={styles.page}>
      <ScrollToTopButton />
      <Column gap="m">
        <Breadcrumbs
          items={[
            { to: "/", label: t("common:navigation.myAnime") },
            { label: t("common:list.recommendations") },
          ]}
        />
        <Heading variant="neutral">{t("common:list.recommendations")}</Heading>
        <QueryErrorBoundary resetKeys={[accountState.account?.id]}>
          <ListRecommendationsContent accountState={accountState} />
        </QueryErrorBoundary>
      </Column>
    </Container>
  );
}

type ListRecommendationsContentProps = { accountState: AccountState };

function ListRecommendationsContent({
  accountState,
}: ListRecommendationsContentProps) {
  const { t } = useTranslation(["common"]);
  const { mode: contentMode } = useAdultContent();
  const [sort, setSort] = useState<MediaRecommendationSort>(DEFAULT_SORT);
  const { items, listQuery, sourceAnime, recommendationsQuery } =
    useListRecommendations({
      sort,
      contentMode,
      account: accountState.account,
    });
  const { isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    recommendationsQuery;
  const handleSortChange = (value: string) =>
    setSort(value as MediaRecommendationSort);

  useEffect(() => {
    if (items.length === 0 && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching, items.length]);

  const isLoading =
    listQuery.isPending ||
    (sourceAnime.length > 0 && recommendationsQuery.isPending);
  const isLoadingNextBatch = isFetchingNextPage;
  const showNoCompletedAnime = !listQuery.isPending && sourceAnime.length === 0;
  const skeletonFooter = isLoadingNextBatch ? (
    <div className={styles.skeletonGrid}>
      {SKELETON_ITEMS.map((index) => (
        <MediaCardSkeleton size="l" key={index} />
      ))}
    </div>
  ) : null;

  if (isLoading) {
    return (
      <GridList
        data={SKELETON_ITEMS}
        renderItem={() => <MediaCardSkeleton size="l" />}
      />
    );
  }

  return (
    <Column gap="m" className={styles.resultsContainer}>
      <div className={styles.toolbar}>
        <LabeledCombobox
          value={sort}
          className={styles.sort}
          label={t("common:sortLabel")}
          onValueChange={handleSortChange}
          options={RECOMMENDATION_SORTS.map((value) => ({
            value,
            label: t(`common:recommendationSort.${value}`),
          }))}
        />
      </div>
      {showNoCompletedAnime ? (
        <Row alignItem="center" justifyContent="center">
          <BlockStatusBase
            icon={<NoContentIcon />}
            title={t("common:listRecommendations.noCompletedAnimeTitle")}
            description={t(
              "common:listRecommendations.noCompletedAnimeDescription",
            )}
          />
        </Row>
      ) : items.length === 0 ? (
        <Row alignItem="center" justifyContent="center">
          <BlockStatusBase
            icon={<NoContentIcon />}
            title={t("common:listRecommendations.noRecommendationsTitle")}
            description={t(
              "common:listRecommendations.noRecommendationsDescription",
            )}
          />
        </Row>
      ) : (
        <GridList
          virtualize
          data={items}
          footer={skeletonFooter}
          getKey={(item) => item.id}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          renderItem={(item) => (
            <MediaCardContextMenu
              size="l"
              media={item}
              userId={accountState.account?.id}
            />
          )}
        />
      )}
    </Column>
  );
}
