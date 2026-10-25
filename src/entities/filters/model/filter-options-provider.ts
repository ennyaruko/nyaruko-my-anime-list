import { createServiceToken } from "@/shared/lib";

import type { FilterOptions } from "./filter-options";

/** Data port for retrieving the options used to filter media. */
export interface FilterOptionsProvider {
  getFilterOptions(signal?: AbortSignal): Promise<FilterOptions>;
}

/** Provider implementation is registered by the application composition root. */
export const filterOptionsProviderToken =
  createServiceToken<FilterOptionsProvider>("filterOptionsProvider");
