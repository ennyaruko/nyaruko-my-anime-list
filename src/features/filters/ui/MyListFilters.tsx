import { useMemo, type ReactNode } from "react";

import type { FilterOptions } from "@/entities/filters";
import type { MyListEntry, MyListStatus } from "@/entities/media";

import { useMediaFilters } from "../model/useMediaFilters";
import { listSortOptions } from "../model/media-filter-options";
import { filterMyListEntries } from "../model/filter-my-list-entries";

import { MediaFiltersPanel } from "./MediaFiltersPanel";
import { useFilterDrawerState } from "./useFilterDrawerState";

type MyListFiltersProps = {
  userId?: string;
  status: MyListStatus;
  entries: MyListEntry[];
  options?: FilterOptions;
  optionsLoading?: boolean;
  children: (
    filteredEntries: MyListEntry[],
    resetFilters: VoidFunction,
    hasUnsavedChanges: boolean,
  ) => ReactNode;
};

/** Owns list filter settings and exposes only the resulting entries. */
export function MyListFilters({
  status,
  userId,
  entries,
  options,
  children,
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
    () => filterMyListEntries(entries, status, filters),
    [entries, filters, status],
  );

  return (
    <>
      <MediaFiltersPanel
        filters={filters}
        options={options}
        onSave={saveFilters}
        onReset={resetFilters}
        onChange={updateFilters}
        open={filterDrawer.open}
        savedFilters={savedFilters}
        sortOptions={listSortOptions}
        optionsLoading={optionsLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenChange={filterDrawer.onOpenChange}
      />
      {children(filteredEntries, resetFilters, hasUnsavedChanges)}
    </>
  );
}
