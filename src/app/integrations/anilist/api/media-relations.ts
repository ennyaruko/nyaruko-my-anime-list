import type { MediaRelation } from "@/entities/media";

import { mapAniListMedia } from "./media-mapper";
import { MediaRelationsDocument } from "./queries";
import { createAniListGraphQLClient } from "./client";

/** Loads and maps the anime relations returned by AniList. */
export async function getAniListMediaRelations(
  accessToken: string,
  mediaId: number,
  signal?: AbortSignal,
): Promise<MediaRelation[]> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    variables: { id: mediaId },
    document: MediaRelationsDocument,
  });

  return (response.Media?.relations?.edges ?? []).flatMap((edge) => {
    const relatedMedia = edge?.node;

    if (!relatedMedia || relatedMedia.type !== "ANIME") return [];

    return [
      {
        type: edge?.relationType ?? null,
        media: mapAniListMedia(relatedMedia),
      },
    ];
  });
}
