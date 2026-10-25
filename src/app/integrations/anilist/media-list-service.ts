import type { MyListService } from "@/entities/media";

import { getViewerMediaList } from "./api/media-list";

/** Adapter implementing the provider-neutral anime-list application contract. */
export const aniListMediaListService: MyListService = {
  async getMyList(accessToken, userId, signal) {
    return getViewerMediaList(accessToken, Number(userId), signal);
  },
};
