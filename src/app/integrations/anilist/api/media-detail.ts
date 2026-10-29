import type { MediaTag, MediaDetail } from "@/entities/media";

import { MediaDetailDocument } from "./queries";
import { mapAniListMedia } from "./media-mapper";
import { createAniListGraphQLClient } from "./client";

/** Loads the full media detail with private list-entry fields for the viewer. */
export async function getAniListMediaDetail(
  accessToken: string,
  mediaId: number,
  signal?: AbortSignal,
): Promise<MediaDetail> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    variables: { id: mediaId },
    document: MediaDetailDocument,
  });
  const data = response.Media;

  if (!data) {
    throw new Error("AniList did not return the requested media.");
  }

  return {
    malId: data.idMal ?? null,
    media: mapAniListMedia(data),
    titles: [
      data.title?.romaji,
      data.title?.english,
      data.title?.native,
    ].filter((title): title is string => Boolean(title)),
    tags: (data.tags ?? [])
      .filter((tag): tag is NonNullable<typeof tag> => tag !== null)
      .map((tag): MediaTag => ({
        name: tag.name,
        rank: tag.rank ?? 0,
      }))
      .sort((left, right) => right.rank - left.rank),
  };
}
