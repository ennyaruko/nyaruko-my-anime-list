import type { MediaFiltersState } from "@/entities/filters";
import type { MediaSearchParameters } from "@/entities/media";

import type { AppliedMediaFilterValues } from "./useMediaFilters";

function getSearchSort(sort: string): MediaSearchParameters["sort"] {
  switch (sort) {
    case "popularity":
    case "averageScore":
    case "title":
      return sort;
    default:
      return "releaseDate";
  }
}

/** Maps the UI filter model into provider-neutral search parameters. */
export function getMediaSearchParameters(
  search: string,
  filters: MediaFiltersState,
  appliedValues: AppliedMediaFilterValues,
  perPage: number,
  contentMode: MediaSearchParameters["contentMode"],
): MediaSearchParameters {
  return {
    search,
    page: 1,
    perPage,
    contentMode,
    tags: filters.tags,
    genres: filters.genres,
    formats: appliedValues.formats,
    sources: appliedValues.sources,
    statuses: appliedValues.statuses,
    sort: getSearchSort(filters.sort),
    statusFilterEnabled: appliedValues.statusFilterEnabled,
    formatFilterEnabled: appliedValues.formatFilterEnabled,
    sourceFilterEnabled: appliedValues.sourceFilterEnabled,
  };
}
