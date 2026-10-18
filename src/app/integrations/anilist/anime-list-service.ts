import type { AnimeListService } from "@/entities/anime-list";

import { getViewerAnimeList, mapAniListAnimeListEntry } from "./api/anime-list";

/** Adapter implementing the provider-neutral anime-list application contract. */
export const aniListAnimeListService: AnimeListService = {
  async getAnimeList(accessToken, userId, signal) {
    const entries = await getViewerAnimeList(
      accessToken,
      Number(userId),
      signal,
    );
    return entries.map(mapAniListAnimeListEntry);
  },
};
