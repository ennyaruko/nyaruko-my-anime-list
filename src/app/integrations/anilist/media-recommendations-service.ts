import type { MediaRecommendationsService } from "@/entities/media";

import { getAniListMediaRecommendations } from "./api/media-recommendations";

/** AniList adapter for paginated media recommendations. */
export const aniListMediaRecommendationsService: MediaRecommendationsService = {
  getMediaRecommendations: getAniListMediaRecommendations,
};
