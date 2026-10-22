import type { MyListService } from "@/entities/my-list";

import { getViewerAnimeList } from "./api/anime-list";

/** Adapter implementing the provider-neutral anime-list application contract. */
export const aniListAnimeListService: MyListService = {
  async getMyList(accessToken, userId, signal) {
    return getViewerAnimeList(accessToken, Number(userId), signal);
  },
};
