import { createServiceToken } from "@/shared/lib";

import type { MediaRecommendationsPage } from "./media-detail";

/** Application port for loading paginated similar media. */
export type MediaRecommendationsService = {
  /** Loads one provider page of similar media recommendations. */
  getMediaRecommendations(
    accessToken: string,
    mediaId: number,
    page: number,
    signal?: AbortSignal,
  ): Promise<MediaRecommendationsPage>;
};

export const mediaRecommendationsServiceToken =
  createServiceToken<MediaRecommendationsService>(
    "mediaRecommendationsService",
  );
