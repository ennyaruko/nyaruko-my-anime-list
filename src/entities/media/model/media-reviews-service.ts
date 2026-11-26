import { createServiceToken } from "@/shared/lib";

import type { MediaReviewsPage } from "./media-detail";

/** Application port for loading public reviews for a media item. */
export type MediaReviewsService = {
  /** Loads one page of highest-rated reviews for the requested media. */
  getMediaReviews(
    accessToken: string,
    mediaId: number,
    page: number,
    perPage: number,
    signal?: AbortSignal,
  ): Promise<MediaReviewsPage>;
};

export const mediaReviewsServiceToken = createServiceToken<MediaReviewsService>(
  "mediaReviewsService",
);
