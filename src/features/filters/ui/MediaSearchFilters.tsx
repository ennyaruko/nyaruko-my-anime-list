import { useMemo, type ReactNode } from "react";

import type { MediaSearchParameters } from "@/entities/media";
import type { FilterOptions, MediaFiltersState } from "@/entities/filters";

import { useMediaFilters } from "../model/useMediaFilters";
import { searchSortOptions } from "../model/media-filter-options";
import { getMediaSearchParameters } from "../model/media-search-parameters";

import { MediaFiltersPanel } from "./MediaFiltersPanel";
import { useFilterDrawerState } from "./useFilterDrawerState";

type MediaSearchFiltersProps = {
  search: string;
  userId?: string;
  perPage: number;
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
  } = useMediaFilters("search", userId, initialFilters);

  const parameters = useMemo(
    () => getMediaSearchParameters(search, filters, appliedValues, perPage),
    [appliedValues, filters, perPage, search],
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
