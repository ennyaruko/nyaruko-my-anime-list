import { createServiceToken } from "@/shared/lib";

/** A selectable value exposed by the application's filter controls. */
export type FilterOption = {
  value: string;
  label: string;
};

/** Provider-neutral filter data used by the application. */
export type FilterOptions = {
  tags: FilterOption[];
  genres: FilterOption[];
};

/** Sort modes available to media list and search surfaces. */
export type MediaSortKey =
  | "score"
  | "title"
  | "progress"
  | "startDate"
  | "lastAdded"
  | "popularity"
  | "releaseDate"
  | "lastUpdated"
  | "averageScore"
  | "completedDate";

/** Data port for retrieving the options used to filter media. */
export interface FilterOptionsProvider {
  getFilterOptions(signal?: AbortSignal): Promise<FilterOptions>;
}

/** Concrete filter-options provider is registered by the application composition root. */
export const filterOptionsProviderToken =
  createServiceToken<FilterOptionsProvider>("filterOptionsProvider");
