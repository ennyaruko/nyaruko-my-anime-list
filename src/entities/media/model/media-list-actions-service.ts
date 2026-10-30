import { createServiceToken } from "@/shared/lib";

import type { MyListStatus } from "./my-list";

/** Application port for changing the authenticated user's media-list entries. */
export type MediaListActionsService = {
  /** Removes a media-list entry by its provider-specific entry ID. */
  removeEntry(accessToken: string, listEntryId: number): Promise<void>;
  /** Updates the current user's score for a media item. */
  updateScore(
    accessToken: string,
    mediaId: number,
    score: number,
  ): Promise<void>;
  /** Sets a media item's status, creating an entry when it does not exist. */
  setStatus(
    accessToken: string,
    mediaId: number,
    status: MyListStatus,
  ): Promise<void>;
  /** Updates the watched-episode progress for a media item. */
  updateProgress(
    accessToken: string,
    mediaId: number,
    progress: number,
    options?: { keepalive?: boolean; status?: MyListStatus },
  ): Promise<void>;
};

export const mediaListActionsServiceToken =
  createServiceToken<MediaListActionsService>("mediaListActionsService");
