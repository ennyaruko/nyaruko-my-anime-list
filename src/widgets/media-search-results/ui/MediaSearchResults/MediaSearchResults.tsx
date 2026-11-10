import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { hashKey } from "@tanstack/react-query";

import type { SearchPosition } from "@/features/search-position";
import { MediaCardContextMenu } from "@/features/manage-media-list";
import {
  useSearchPosition,
  SearchPositionMenu,
  useSearchPositionResume,
  useSearchPositionQuickRestore,
} from "@/features/search-position";

import { MediaCardSkeleton } from "@/entities/media";
import type { AccountState } from "@/entities/account";
import type { MediaFiltersState } from "@/entities/filters";
import type { MediaContentMode, MediaSearchParameters } from "@/entities/media";

import { Button, GridList, BlockStatusEmpty } from "@/shared/ui";

import { useMediaSearchResults } from "../../model/useMediaSearchResults";
import { useVisibleSearchPosition } from "../../model/useVisibleSearchPosition";

import * as styles from "./MediaSearchResults.css";

export type MediaSearchResultsProps = {
  filters: MediaFiltersState;
  contentMode: MediaContentMode;
  account: AccountState["account"];
  parameters: MediaSearchParameters;
  updateFilters: (updates: Partial<MediaFiltersState>) => void;
};

export function MediaSearchResults(props: MediaSearchResultsProps) {
  return (
    <SearchResults
      key={`${props.account?.id}:${props.contentMode}`}
      {...props}
    />
  );
}

function SearchResults({
  account,
  filters,
  parameters,
  contentMode,
  updateFilters,
}: MediaSearchResultsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const { isLoaded, savePosition, clearPosition, savedPosition } =
    useSearchPosition({
      contentMode,
      userId: account?.id,
    });
  const {
    restoring,
    activeResume,
    matchesResume,
    returnToStart,
    restorePosition,
    getInitialIndex,
  } = useSearchPositionResume({
    parameters,
    updateFilters,
  });
  useSearchPositionQuickRestore({
    isLoaded,
    savedPosition,
    onRestore: restorePosition,
  });
  const { captureAnchor } = useVisibleSearchPosition({ containerRef: listRef });
  return (
    <div ref={listRef} className={styles.resultsContainer}>
      <SearchPositionMenu
        filters={filters}
        onSave={savePosition}
        onClear={clearPosition}
        parameters={parameters}
        capture={captureAnchor}
        contentMode={contentMode}
        onRestore={restorePosition}
        savedPosition={savedPosition}
      />
      {restoring && !matchesResume ? (
        <SearchSkeletons />
      ) : (
        <Results
          account={account}
          resume={activeResume}
          parameters={parameters}
          getInitialIndex={getInitialIndex}
          onReturnToStart={activeResume ? returnToStart : undefined}
          key={hashKey([
            parameters,
            activeResume?.lastPage ?? 1,
            activeResume?.lastAnime ?? null,
          ])}
        />
      )}
    </div>
  );
}

function SearchSkeletons() {
  return (
    <GridList
      data={[0, 1, 2, 3, 4, 5]}
      renderItem={() => <MediaCardSkeleton size="l" />}
    />
  );
}

type ResultsProps = {
  resume: null | SearchPosition;
  onReturnToStart?: VoidFunction;
  account: AccountState["account"];
  parameters: MediaSearchParameters;
  getInitialIndex: (animeIds: readonly number[]) => number | undefined;
};

function Results({
  resume,
  account,
  parameters,
  getInitialIndex,
  onReturnToStart,
}: ResultsProps) {
  const { t } = useTranslation(["common"]);
  const query = useMediaSearchResults({
    account,
    parameters,
    initialPage: resume?.lastPage ?? 1,
  });
  const results = query.pages.flatMap(({ page, items }) =>
    items.map((media, index) => ({ page, media, index })),
  );
  const initialIndex = getInitialIndex(results.map(({ media }) => media.id));
  const hasNoResults = results.length === 0 && !query.isPending;
  const skeletons = query.isFetchingNextPage ? (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: 6 }, (_, index) => (
        <MediaCardSkeleton size="l" key={index} />
      ))}
    </div>
  ) : null;

  return (
    <div>
      {onReturnToStart && (
        <Button
          variant="secondary"
          onClick={onReturnToStart}
          className={styles.returnButton}
        >
          {t("common:searchPosition.returnToStart")}
        </Button>
      )}
      {query.isPending ? (
        <SearchSkeletons />
      ) : hasNoResults ? (
        <BlockStatusEmpty className={styles.empty} />
      ) : (
        <GridList
          virtualize
          data={results}
          footer={skeletons}
          endReached={query.loadMore}
          getKey={({ media }) => media.id}
          initialTopMostItemIndex={initialIndex}
          renderItem={({ page, media }) => (
            <div data-search-page={page} data-search-anime={media.id}>
              <MediaCardContextMenu
                size="l"
                media={media}
                userId={account?.id}
              />
            </div>
          )}
        />
      )}
    </div>
  );
}
