import { useMemo, type ReactNode } from "react";

import type { FilterOptions, MediaFiltersState } from "@/entities/filters";
import type { MediaContentMode, MediaSearchParameters } from "@/entities/media";

import { useMediaFilters } from "../model/useMediaFilters";
import type { MediaFilterScope } from "../model/useMediaFilters";
import { searchSortOptions } from "../model/media-filter-options";
import { getMediaSearchParameters } from "../model/media-search-parameters";
import { filterTagsForContentMode } from "../model/filter-tags-for-content-mode";

import { MediaFiltersPanel } from "./MediaFiltersPanel";
import { useFilterDrawerState } from "./useFilterDrawerState";

type MediaSearchFiltersProps = {
  search: string;
  userId?: string;
  perPage: number;
  options?: FilterOptions;
  optionsLoading?: boolean;
  scope?: MediaFilterScope;
  contentMode: MediaContentMode;
  onResetInitialFilters?: VoidFunction;
  initialFilters?: Partial<MediaFiltersState>;
  children: (
    parameters: MediaSearchParameters,
    filters: MediaFiltersState,
    updateFilters: (updates: Partial<MediaFiltersState>) => void,
  ) => ReactNode;
};

/** Owns search filter settings and supplies effective API parameters. */
export function MediaSearchFilters({
  search,
  userId,
  options,
  perPage,
  children,
  contentMode,
  optionsLoading,
  scope = "search",
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
  } = useMediaFilters(scope, userId, contentMode, initialFilters);

  const parameters = useMemo(() => {
    const searchParameters = getMediaSearchParameters(
      search,
      {
        ...filters,
        tags: filterTagsForContentMode(filters.tags, options, contentMode),
      },
      appliedValues,
      perPage,
      contentMode,
    );

    return searchParameters;
  }, [appliedValues, contentMode, filters, options, perPage, search]);
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
        contentMode={contentMode}
        onReset={resetAllFilters}
        savedFilters={savedFilters}
        sortOptions={searchSortOptions}
        optionsLoading={optionsLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenChange={filterDrawer.onOpenChange}
      />
      {children(parameters, filters, updateFilters)}
    </>
  );
}
