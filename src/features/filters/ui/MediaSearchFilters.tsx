import { useMemo, type ReactNode } from "react";

import type { MediaSearchParameters } from "@/entities/media";
import type { FilterOptions, MediaFiltersState } from "@/entities/filters";

import { useMediaFilters } from "../model/useMediaFilters";
import { searchSortOptions } from "../model/media-filter-options";
import { getMediaSearchParameters } from "../model/media-search-parameters";
import { filterTagsForAdultMode } from "../model/filter-tags-for-adult-mode";

import { MediaFiltersPanel } from "./MediaFiltersPanel";
import { useFilterDrawerState } from "./useFilterDrawerState";

type MediaSearchFiltersProps = {
  search: string;
  userId?: string;
  perPage: number;
  isAdultMode: boolean;
  options?: FilterOptions;
  optionsLoading?: boolean;
  onResetInitialFilters?: VoidFunction;
  initialFilters?: Partial<MediaFiltersState>;
  children: (parameters: MediaSearchParameters) => ReactNode;
};

/** Owns search filter settings and supplies effective API parameters. */
export function MediaSearchFilters({
  search,
  userId,
  options,
  perPage,
  children,
  isAdultMode,
  optionsLoading,
  initialFilters = {},
  onResetInitialFilters,
}: MediaSearchFiltersProps) {
  const filterDrawer = useFilterDrawerState();
  const {
    filters,
    saveFilters,
    savedFilters,
    resetFilters,
    updateFilters,
    appliedValues,
    hasUnsavedChanges,
  } = useMediaFilters("search", userId, isAdultMode, initialFilters);

  const parameters = useMemo(
    () =>
      getMediaSearchParameters(
        search,
        {
          ...filters,
          tags: filterTagsForAdultMode(filters.tags, options, isAdultMode),
        },
        appliedValues,
        perPage,
        isAdultMode,
      ),
    [appliedValues, filters, isAdultMode, options, perPage, search],
  );
  const resetAllFilters = () => {
    resetFilters();
    onResetInitialFilters?.();
  };

  return (
    <>
      <MediaFiltersPanel
        filters={filters}
        options={options}
        onSave={saveFilters}
        open={filterDrawer.open}
        onChange={updateFilters}
        isAdultMode={isAdultMode}
        onReset={resetAllFilters}
        savedFilters={savedFilters}
        sortOptions={searchSortOptions}
        optionsLoading={optionsLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenChange={filterDrawer.onOpenChange}
      />
      {children(parameters)}
    </>
  );
}
