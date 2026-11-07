import { useMemo, type ReactNode } from "react";

import type { FilterOptions } from "@/entities/filters";
import type { MediaContentMode } from "@/entities/media";
import type { MyListEntry, MyListStatus } from "@/entities/media";

import { useMediaFilters } from "../model/useMediaFilters";
import { listSortOptions } from "../model/media-filter-options";
import { filterMyListEntries } from "../model/filter-my-list-entries";
import { filterTagsForContentMode } from "../model/filter-tags-for-content-mode";

import { MediaFiltersPanel } from "./MediaFiltersPanel";
import { useFilterDrawerState } from "./useFilterDrawerState";

type MyListFiltersProps = {
  userId?: string;
  status: MyListStatus;
  entries: MyListEntry[];
  options?: FilterOptions;
  optionsLoading?: boolean;
  contentMode: MediaContentMode;
  children: (
    filteredEntries: MyListEntry[],
    resetFilters: VoidFunction,
    hasUnsavedChanges: boolean,
    filtersPanel: ReactNode,
  ) => ReactNode;
};

/** Owns list filter settings and exposes only the resulting entries. */
export function MyListFilters({
  status,
  userId,
  entries,
  options,
  children,
  contentMode,
  optionsLoading,
}: MyListFiltersProps) {
  const filterDrawer = useFilterDrawerState();
  const {
    filters,
    saveFilters,
    savedFilters,
    resetFilters,
    updateFilters,
    hasUnsavedChanges,
  } = useMediaFilters("my-list", userId, contentMode);

  const filteredEntries = useMemo(
    () =>
      filterMyListEntries(
        entries,
        status,
        {
          ...filters,
          tags: filterTagsForContentMode(filters.tags, options, contentMode),
        },
        contentMode,
      ),
    [contentMode, entries, filters, options, status],
  );

  return children(
    filteredEntries,
    resetFilters,
    hasUnsavedChanges,
    <MediaFiltersPanel
      filters={filters}
      options={options}
      showFavoriteFilter
      onSave={saveFilters}
      onReset={resetFilters}
      onChange={updateFilters}
      open={filterDrawer.open}
      contentMode={contentMode}
      savedFilters={savedFilters}
      sortOptions={listSortOptions}
      optionsLoading={optionsLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      onOpenChange={filterDrawer.onOpenChange}
    />,
  );
}
