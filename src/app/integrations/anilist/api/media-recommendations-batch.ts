import type { Media, MediaRecommendationSort } from "@/entities/media";

import { mapAniListMedia } from "./media-mapper";
import { createAniListGraphQLClient } from "./client";
import { MediaRecommendationsBatchDocument } from "./queries";
import type { RecommendationSort } from "./generated/graphql";

const RECOMMENDATIONS_PER_SOURCE = 50;

const recommendationSort: Record<MediaRecommendationSort, RecommendationSort> =
  {
    rating: "RATING",
    ratingDesc: "RATING_DESC",
  };

/** Loads one configured batch of recommendations in a single AniList request. */
export async function getAniListMediaRecommendationsForSources(
  accessToken: string,
  sourceMediaIds: number[],
  sort: MediaRecommendationSort,
  signal?: AbortSignal,
): Promise<Media[]> {
  const client = createAniListGraphQLClient(accessToken);
  const ids = Array.from(
    { length: 10 },
    (_, index) => sourceMediaIds[index] ?? null,
  );
  const response = await client.request({
    signal,
    document: MediaRecommendationsBatchDocument,
    variables: {
      id0: ids[0],
      id1: ids[1],
      id2: ids[2],
      id3: ids[3],
      id4: ids[4],
      id5: ids[5],
      id6: ids[6],
      id7: ids[7],
      id8: ids[8],
      id9: ids[9],
      sort: [recommendationSort[sort]],
      include0: sourceMediaIds.length > 0,
      include1: sourceMediaIds.length > 1,
      include2: sourceMediaIds.length > 2,
      include3: sourceMediaIds.length > 3,
      include4: sourceMediaIds.length > 4,
      include5: sourceMediaIds.length > 5,
      include6: sourceMediaIds.length > 6,
      include7: sourceMediaIds.length > 7,
      include8: sourceMediaIds.length > 8,
      include9: sourceMediaIds.length > 9,
      perPage: RECOMMENDATIONS_PER_SOURCE,
    },
  });

  const recommendations = [
    response.source0,
    response.source1,
    response.source2,
    response.source3,
    response.source4,
    response.source5,
    response.source6,
    response.source7,
    response.source8,
    response.source9,
  ].flatMap(
    (source) =>
      source?.recommendations?.nodes?.flatMap((node) => {
        const media = node?.mediaRecommendation;
        return media?.type === "ANIME" && !media.mediaListEntry
          ? [mapAniListMedia(media)]
          : [];
      }) ?? [],
  );

  return [
    ...new Map(recommendations.map((media) => [media.id, media])).values(),
  ];
}
