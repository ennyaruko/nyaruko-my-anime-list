import type { MediaRecommendationsService } from "@/entities/media";

import { getAniListMediaRecommendations } from "./api/media-recommendations";
import { getAniListMediaRecommendationsForSources } from "./api/media-recommendations-batch";

/** AniList adapter for paginated media recommendations. */
export const aniListMediaRecommendationsService: MediaRecommendationsService = {
  getMediaRecommendations: getAniListMediaRecommendations,
  getMediaRecommendationsForSources: getAniListMediaRecommendationsForSources,
};
