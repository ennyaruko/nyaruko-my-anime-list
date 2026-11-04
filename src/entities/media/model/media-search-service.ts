import { createServiceToken } from "@/shared/lib";

import type { MediaSearchResult, MediaSearchParameters } from "./media-search";

export type MediaSearchOptions = { signal?: AbortSignal };

/** Application port for searching provider-neutral media records. */
export type MediaSearchService = {
  searchMedia(
    parameters: MediaSearchParameters,
    options?: MediaSearchOptions,
  ): Promise<MediaSearchResult>;
};

export const mediaSearchServiceToken =
  createServiceToken<MediaSearchService>("mediaSearchService");
