import type { MediaDetailService } from "@/entities/media";

import { getAniListMediaDetail } from "./api/media-detail";

/** AniList adapter for the provider-neutral media detail contract. */
export const aniListMediaDetailService: MediaDetailService = {
  getMediaDetail: getAniListMediaDetail,
};
