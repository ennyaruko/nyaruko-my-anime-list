import { MyListFilters } from "@/features/filters";
import { useAdultContent } from "@/features/toggle-adult-content";
import { useWatchQueue, WatchQueueDialog } from "@/features/watch-queue";

import type { AccountState } from "@/entities/account";

import {
  Column,
  Spinner,
  Container,
  Breadcrumbs,
  PullToRefresh,
  ScrollToTopButton,
  ComponentErrorBoundary,
} from "@/shared/ui";

import { useMyListStatus } from "../model/useMyListStatus";
import { useMyListPageData } from "../model/useMyListPageData";

import { MyListGenres } from "./MyListGenres";
import { MyListContent } from "./MyListContent";

import * as styles from "./MyListPage.css";

export function MyListPage(accountState: AccountState) {
  const { mode: contentMode } = useAdultContent();
  const { userId, entries, refreshList, isListPending, filterOptionsQuery } =
    useMyListPageData(accountState, contentMode);
  const { selectStatus, selectedStatus } = useMyListStatus();
  const watchQueue = useWatchQueue();

  return (
    <Container as="main" className={styles.page}>
      <ScrollToTopButton />
      <WatchQueueDialog
        items={watchQueue.items}
        isOpen={watchQueue.isOpen}
        onOpen={watchQueue.openDialog}
        onClear={watchQueue.clearQueue}
        onClose={watchQueue.closeDialog}
        onRemove={watchQueue.removeMedia}
        selectedMedia={watchQueue.selectedMedia}
        onPickRandom={watchQueue.pickRandomMedia}
      />
      <Column gap="m">
        <Breadcrumbs
          items={[{ to: "/", label: "Аниме" }, { label: "Моё аниме" }]}
        />
        <PullToRefresh
          pullingContent=""
          onRefresh={refreshList}
          refreshingContent={<Spinner />}
        >
          <Column gap="m">
            <MyListFilters
              userId={userId}
              entries={entries}
              status={selectedStatus}
              contentMode={contentMode}
              options={filterOptionsQuery.data}
              optionsLoading={filterOptionsQuery.isPending}
            >
              {(
                filteredEntries,
                resetFilters,
                hasUnsavedChanges,
                filtersPanel,
                filterByGenre,
              ) => (
                <>
                  <ComponentErrorBoundary>
                    <MyListGenres
                      entries={entries}
                      isPending={isListPending}
                      onGenreClick={filterByGenre}
                    />
                  </ComponentErrorBoundary>
                  <ComponentErrorBoundary>
                    <MyListContent
                      userId={userId}
                      entries={entries}
                      selectStatus={selectStatus}
                      resetFilters={resetFilters}
                      filtersPanel={filtersPanel}
                      isListPending={isListPending}
                      selectedStatus={selectedStatus}
                      filteredEntries={filteredEntries}
                      onAddToWatch={watchQueue.addMedia}
                      hasUnsavedChanges={hasUnsavedChanges}
                    />
                  </ComponentErrorBoundary>
                </>
              )}
            </MyListFilters>
          </Column>
        </PullToRefresh>
      </Column>
    </Container>
  );
}
