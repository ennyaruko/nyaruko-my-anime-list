import type { MyListStatus } from "@/entities/media";

import { createAniListGraphQLClient } from "./client";
import {
  SaveMediaListEntryDocument,
  DeleteMediaListEntryDocument,
  ToggleMediaFavouriteDocument,
} from "./queries";

/** Creates or updates the AniList entry for a media item. */
export async function saveAniListMediaListEntry(
  accessToken: string,
  mediaId: number,
  changes: { score?: number; progress?: number; status?: MyListStatus },
  keepalive = false,
): Promise<void> {
  const client = createAniListGraphQLClient(accessToken, keepalive);
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

/** Toggles whether the viewer has marked an anime as a favorite. */
export async function toggleAniListMediaFavourite(
  accessToken: string,
  mediaId: number,
): Promise<void> {
  const client = createAniListGraphQLClient(accessToken);
  const mutationResponse = await client.request({
    variables: { animeId: mediaId },
    document: ToggleMediaFavouriteDocument,
  });

  if (!mutationResponse.ToggleFavourite) {
    throw new Error("AniList did not confirm the favorite update.");
  }
}
