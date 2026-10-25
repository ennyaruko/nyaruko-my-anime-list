import { createServiceToken } from "@/shared/lib";

import type { MediaSearchResult, MediaSearchParameters } from "./media-search";

/** Application port for searching provider-neutral media records. */
export type MediaSearchService = {
  searchMedia(
    parameters: MediaSearchParameters,
    signal?: AbortSignal,
  ): Promise<MediaSearchResult>;
};

export const mediaSearchServiceToken =
  createServiceToken<MediaSearchService>("mediaSearchService");
