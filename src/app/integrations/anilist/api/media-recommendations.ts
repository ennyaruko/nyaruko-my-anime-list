import type { MediaRecommendationsPage } from "@/entities/media";

import { mapAniListMedia } from "./media-mapper";
import { createAniListGraphQLClient } from "./client";
import { MediaRecommendationsDocument } from "./queries";

const RECOMMENDATIONS_PER_PAGE = 5;

/** Loads and maps one page of AniList recommendations. */
export async function getAniListMediaRecommendations(
  accessToken: string,
  mediaId: number,
  page: number,
  signal?: AbortSignal,
): Promise<MediaRecommendationsPage> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    document: MediaRecommendationsDocument,
    variables: { page, id: mediaId, perPage: RECOMMENDATIONS_PER_PAGE },
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
