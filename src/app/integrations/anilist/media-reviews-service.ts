import type { MediaReviewsService } from "@/entities/media";

import { getAniListMediaReviews } from "./api/media-reviews";

/** AniList adapter for media reviews. */
export const aniListMediaReviewsService: MediaReviewsService = {
  getMediaReviews: getAniListMediaReviews,
};
