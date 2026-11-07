import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

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
  LabeledCheckbox,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParameter = searchParams.get("sort");
  const sort: MediaRecommendationSort = RECOMMENDATION_SORTS.includes(
    sortParameter as MediaRecommendationSort,
  )
    ? (sortParameter as MediaRecommendationSort)
    : DEFAULT_SORT;
  const randomSeedParameter = searchParams.get("randomSeed");
  const parsedRandomSeed = randomSeedParameter
    ? Number(randomSeedParameter)
    : null;
  const hasRandomSeed =
    parsedRandomSeed !== null && Number.isSafeInteger(parsedRandomSeed);
  const random = searchParams.get("random") === "1" && hasRandomSeed;
  const randomSeed = random ? (parsedRandomSeed as number) : 0;
  const { items, listQuery, sourceAnime, recommendationsQuery } =
    useListRecommendations({
      sort,
      random,
      randomSeed,
      contentMode,
      account: accountState.account,
    });
  const { isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    recommendationsQuery;
  const handleSortChange = (value: string) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("sort", value);
        return nextParams;
      },
      { replace: true, preventScrollReset: true },
    );
  };
  const handleRandomChange = (checked: boolean) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        if (checked) {
          nextParams.set("random", "1");
          nextParams.set(
            "randomSeed",
            String(Math.floor(Math.random() * 0x1_0000_0000)),
          );
        } else {
          nextParams.delete("random");
          nextParams.delete("randomSeed");
        }
        return nextParams;
      },
      { replace: true, preventScrollReset: true },
    );
  };

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

  return (
    <Column gap="m" className={styles.resultsContainer}>
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
          onValueChange={handleSortChange}
          options={RECOMMENDATION_SORTS.map((value) => ({
            value,
            label: t(`common:recommendationSort.${value}`),
          }))}
        />
        <LabeledCheckbox
          size="s"
          checked={random}
          className={styles.randomToggle}
          label={t("common:listRecommendations.random")}
          onCheckedChange={(checked) => handleRandomChange(checked === true)}
        />
      </Row>
      {isLoading ? (
        <GridList
          data={SKELETON_ITEMS}
          renderItem={() => <MediaCardSkeleton size="l" />}
        />
      ) : showNoCompletedAnime ? (
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
