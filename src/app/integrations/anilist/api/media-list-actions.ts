import type { MyListStatus } from "@/entities/media";

import { createAniListGraphQLClient } from "./client";
import {
  SaveMediaListEntryDocument,
  DeleteMediaListEntryDocument,
} from "./queries";

/** Creates or updates the AniList entry for a media item. */
export async function saveAniListMediaListEntry(
  accessToken: string,
  mediaId: number,
  changes: { score?: number; progress?: number; status?: MyListStatus },
): Promise<void> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    variables: { mediaId, ...changes },
    document: SaveMediaListEntryDocument,
  });

  if (!response.SaveMediaListEntry) {
    throw new Error("AniList did not return the updated media-list entry.");
  }
}

/** Deletes an AniList entry by its media-list entry ID. */
export async function deleteAniListMediaListEntry(
  accessToken: string,
  listEntryId: number,
): Promise<void> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    variables: { id: listEntryId },
    document: DeleteMediaListEntryDocument,
  });

  if (!response.DeleteMediaListEntry?.deleted) {
    throw new Error("AniList did not delete the media-list entry.");
  }
}
