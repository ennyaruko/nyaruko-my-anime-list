import type { MyListService } from "@/entities/my-list";

import { getViewerAnimeList, mapAniListMyListEntry } from "./api/anime-list";

/** Adapter implementing the provider-neutral anime-list application contract. */
export const aniListAnimeListService: MyListService = {
  async getMyList(accessToken, userId, signal) {
    const entries = await getViewerAnimeList(
      accessToken,
      Number(userId),
      signal,
    );
    return entries.map(mapAniListMyListEntry);
  },
};
