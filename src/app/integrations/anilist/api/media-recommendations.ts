import type { MediaRecommendationsPage } from "@/entities/media";

import { mapAniListMedia } from "./media-mapper";
import { createAniListGraphQLClient } from "./client";
import { MediaRecommendationsDocument } from "./queries";

const DEFAULT_RECOMMENDATIONS_PER_PAGE = 5;

/** Loads and maps one page of recommendations for a media detail page. */
export async function getAniListMediaRecommendations(
  accessToken: string,
  mediaId: number,
  page: number,
  signal?: AbortSignal,
  perPage = DEFAULT_RECOMMENDATIONS_PER_PAGE,
): Promise<MediaRecommendationsPage> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    document: MediaRecommendationsDocument,
    variables: { page, perPage, id: mediaId },
  });
  const recommendations = response.Media?.recommendations;

  return {
    page,
    hasNextPage: recommendations?.pageInfo?.hasNextPage ?? false,
    items: (recommendations?.nodes ?? []).flatMap((node) => {
      const media = node?.mediaRecommendation;
      return media?.type === "ANIME" ? [mapAniListMedia(media)] : [];
    }),
  };
}
