import type { FilterOptionsProvider } from "@/entities/filters";

import { getAniListFilterOptions } from "./api/filter-options";

/** AniList adapter for the provider-neutral media filter-options contract. */
export const aniListFilterOptionsProvider: FilterOptionsProvider = {
  getFilterOptions: getAniListFilterOptions,
};
