import type { MediaSearchService } from "@/entities/media";

import { searchAniListMedia } from "./api/media-search";

/** AniList adapter for the provider-neutral media search contract. */
export const aniListMediaSearchService: MediaSearchService = {
  searchMedia: searchAniListMedia,
};
