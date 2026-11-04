import { createServiceToken } from "@/shared/lib";

import type { Media } from "./media";
import type { MediaRecommendationsPage } from "./media-detail";

export type MediaRecommendationSort = "rating" | "ratingDesc";

export const MEDIA_RECOMMENDATION_SOURCE_BATCH_SIZE = 5;

/** Application port for loading recommendations for a group of media. */
export type MediaRecommendationsService = {
  /** Loads one recommendation batch for the configured number of media entries. */
  getMediaRecommendationsForSources(
    accessToken: string,
    sourceMediaIds: number[],
    sort: MediaRecommendationSort,
    signal?: AbortSignal,
  ): Promise<Media[]>;
  /** Loads one provider page of recommendations for a media detail page. */
  getMediaRecommendations(
    accessToken: string,
    mediaId: number,
    page: number,
    signal?: AbortSignal,
    perPage?: number,
  ): Promise<MediaRecommendationsPage>;
};

export const mediaRecommendationsServiceToken =
  createServiceToken<MediaRecommendationsService>(
    "mediaRecommendationsService",
  );
