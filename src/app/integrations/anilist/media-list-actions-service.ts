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
  async updateScore(accessToken, mediaId, score) {
    await saveAniListMediaListEntry(accessToken, mediaId, { score });
  },
  async updateProgress(accessToken, mediaId, progress, options) {
    await saveAniListMediaListEntry(
      accessToken,
      mediaId,
      { progress, ...(options?.status ? { status: options.status } : {}) },
      options?.keepalive,
    );
  },
};
