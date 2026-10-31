import { useMemo, type ReactNode } from "react";

import type { FilterOptions } from "@/entities/filters";
import type { MyListEntry, MyListStatus } from "@/entities/media";

import { useMediaFilters } from "../model/useMediaFilters";
import { listSortOptions } from "../model/media-filter-options";
import { filterMyListEntries } from "../model/filter-my-list-entries";
import { filterTagsForAdultMode } from "../model/filter-tags-for-adult-mode";

import { MediaFiltersPanel } from "./MediaFiltersPanel";
import { useFilterDrawerState } from "./useFilterDrawerState";

type MyListFiltersProps = {
  userId?: string;
  status: MyListStatus;
  isAdultMode: boolean;
  entries: MyListEntry[];
  options?: FilterOptions;
  optionsLoading?: boolean;
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
  isAdultMode,
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
  } = useMediaFilters("my-list", userId);

  const filteredEntries = useMemo(
    () =>
      filterMyListEntries(
        entries,
        status,
        {
          ...filters,
          tags: filterTagsForAdultMode(filters.tags, options, isAdultMode),
        },
        isAdultMode,
      ),
    [entries, filters, isAdultMode, options, status],
  );

  return children(
    filteredEntries,
    resetFilters,
    hasUnsavedChanges,
    <MediaFiltersPanel
      filters={filters}
      options={options}
      onSave={saveFilters}
      onReset={resetFilters}
      onChange={updateFilters}
      open={filterDrawer.open}
      isAdultMode={isAdultMode}
      savedFilters={savedFilters}
      sortOptions={listSortOptions}
      optionsLoading={optionsLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      onOpenChange={filterDrawer.onOpenChange}
    />,
  );
}
