import type { MediaListActionsService } from "@/entities/media";

import {
  saveAniListMediaListEntry,
  deleteAniListMediaListEntry,
} from "./api/media-list-actions";

/** Adapter implementing the provider-neutral media-list actions contract. */
export const aniListMediaListActionsService: MediaListActionsService = {
  async removeEntry(accessToken, listEntryId) {
    await deleteAniListMediaListEntry(accessToken, listEntryId);
  },
  async setStatus(accessToken, mediaId, status) {
    await saveAniListMediaListEntry(accessToken, mediaId, { status });
  },
  async updateProgress(accessToken, mediaId, progress) {
    await saveAniListMediaListEntry(accessToken, mediaId, { progress });
  },
};
