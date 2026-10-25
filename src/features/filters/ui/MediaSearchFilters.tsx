import { useMemo, type ReactNode } from "react";

import type { FilterOptions } from "@/entities/filters";
import type { MediaSearchParameters } from "@/entities/media";

import { useMediaFilters } from "../model/useMediaFilters";
import { searchSortOptions } from "../model/media-filter-options";
import { getMediaSearchParameters } from "../model/media-search-parameters";

import { MediaFiltersPanel } from "./MediaFiltersPanel";

type MediaSearchFiltersProps = {
  search: string;
  userId?: string;
  perPage: number;
  options?: FilterOptions;
  optionsLoading?: boolean;
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
}: MediaSearchFiltersProps) {
  const {
    filters,
    saveFilters,
    savedFilters,
    resetFilters,
    updateFilters,
    appliedValues,
    hasUnsavedChanges,
  } = useMediaFilters("search", userId);

  const parameters = useMemo(
    () => getMediaSearchParameters(search, filters, appliedValues, perPage),
    [appliedValues, filters, perPage, search],
  );

  return (
    <>
      <MediaFiltersPanel
        filters={filters}
        options={options}
        onSave={saveFilters}
        onReset={resetFilters}
        onChange={updateFilters}
        savedFilters={savedFilters}
        sortOptions={searchSortOptions}
        optionsLoading={optionsLoading}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      {children(parameters)}
    </>
  );
}
