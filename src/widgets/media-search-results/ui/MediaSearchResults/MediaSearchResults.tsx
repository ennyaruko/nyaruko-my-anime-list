import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { useRef, useState, useEffect, useCallback } from "react";

import { hashKey } from "@tanstack/react-query";

import type { SearchPosition } from "@/features/search-position";
import { MediaCardContextMenu } from "@/features/manage-media-list";
import {
  useSearchPosition,
  SearchPositionMenu,
  SearchPositionExitDialog,
  SEARCH_POSITION_RESTORE_STATE_KEY,
} from "@/features/search-position";

import { MediaCardSkeleton } from "@/entities/media";
import type { AccountState } from "@/entities/account";
import type { MediaFiltersState } from "@/entities/filters";
import type { MediaContentMode, MediaSearchParameters } from "@/entities/media";

import {
  Button,
  GridList,
  BlockStatusEmpty,
  showNotification,
} from "@/shared/ui";

import { useMediaSearchResults } from "../../model/useMediaSearchResults";
import { useVisibleSearchPosition } from "../../model/useVisibleSearchPosition";
import { useSearchPositionExitGuard } from "../../model/useSearchPositionExitGuard";

import * as styles from "./MediaSearchResults.css";

export type MediaSearchResultsProps = {
  filters: MediaFiltersState;
  contentMode: MediaContentMode;
  account: AccountState["account"];
  parameters: MediaSearchParameters;
  updateSearch: (search: string) => void;
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
  updateSearch,
  updateFilters,
}: MediaSearchResultsProps) {
  const { t } = useTranslation(["common"]);
  const location = useLocation();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<null | SearchPosition>(null);
  const [restoring, setRestoring] = useState(false);
  const { isLoaded, savePosition, clearPosition, savedPosition } =
    useSearchPosition({
      contentMode,
      userId: account?.id,
    });
  const locationState = location.state as null | Record<string, unknown>;
  const restoreFromQuickActions =
    locationState?.[SEARCH_POSITION_RESTORE_STATE_KEY] === true;
  const matchesResume =
    resume !== null && hashKey([parameters]) === hashKey([resume.parameters]);
  const activeResume = matchesResume ? resume : null;
  const { captureAnchor, furthestVisiblePage } = useVisibleSearchPosition({
    containerRef: listRef,
    resetKey: hashKey([filters, parameters]),
    baselinePage: activeResume?.lastPage ?? 1,
  });
  const exitGuard = useSearchPositionExitGuard({
    filters,
    parameters,
    contentMode,
    savePosition,
    captureAnchor,
    savedPosition,
    furthestVisiblePage,
    baselinePage: activeResume?.lastPage ?? 1,
  });
  useEffect(() => {
    if (matchesResume) setRestoring(false);
  }, [matchesResume]);

  const handleRestore = useCallback(
    (position: SearchPosition) => {
      setResume(position);
      setRestoring(true);
      updateFilters(position.filters);
      updateSearch(position.parameters.search);
    },
    [updateFilters, updateSearch],
  );

  useEffect(() => {
    if (!restoreFromQuickActions || !isLoaded) return;

    navigate(`${location.pathname}${location.search}${location.hash}`, {
      state: null,
      replace: true,
      preventScrollReset: true,
    });
    if (savedPosition) handleRestore(savedPosition);
  }, [
    handleRestore,
    isLoaded,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    restoreFromQuickActions,
    savedPosition,
  ]);
  const handleReturnToStart = () => {
    setResume(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSaveAndLeave = () => {
    if (!exitGuard.handleSaveAndLeave()) {
      showNotification(t("common:searchPosition.saveFailed"), "error");
    }
  };

  return (
    <div ref={listRef} className={styles.resultsContainer}>
      <SearchPositionMenu
        filters={filters}
        onSave={savePosition}
        onClear={clearPosition}
        parameters={parameters}
        capture={captureAnchor}
        contentMode={contentMode}
        onRestore={handleRestore}
        savedPosition={savedPosition}
      />
      <SearchPositionExitDialog
        onStay={exitGuard.handleStay}
        open={exitGuard.isPromptOpen}
        onLeave={exitGuard.handleLeave}
        onSaveAndLeave={handleSaveAndLeave}
      />
      {restoring && !matchesResume ? (
        <SearchSkeletons />
      ) : (
        <Results
          account={account}
          resume={activeResume}
          parameters={parameters}
          onReturnToStart={activeResume ? handleReturnToStart : undefined}
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
};

function Results({
  resume,
  account,
  parameters,
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
  const initialIndex = resume
    ? Math.max(
        0,
        results.findIndex(({ media }) => media.id === resume.lastAnime),
      )
    : undefined;
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
          restoreVirtualizedState={!resume}
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
