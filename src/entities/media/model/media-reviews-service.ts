import { createServiceToken } from "@/shared/lib";

import type { MediaReview } from "./media-detail";

/** Application port for loading public reviews for a media item. */
export type MediaReviewsService = {
  /** Loads the five highest-rated reviews for the requested media. */
  getMediaReviews(
    accessToken: string,
    mediaId: number,
    signal?: AbortSignal,
  ): Promise<MediaReview[]>;
};

export const mediaReviewsServiceToken = createServiceToken<MediaReviewsService>(
  "mediaReviewsService",
);
