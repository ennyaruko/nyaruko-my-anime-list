import { createServiceToken } from "@/shared/lib";

import type { MediaDetail } from "./media-detail";

/** Application port for loading a user's full media detail page. */
export type MediaDetailService = {
  /** Loads the media detail and viewer-specific list entry from the provider. */
  getMediaDetail(
    accessToken: string,
    mediaId: number,
    signal?: AbortSignal,
  ): Promise<MediaDetail>;
};

export const mediaDetailServiceToken =
  createServiceToken<MediaDetailService>("mediaDetailService");
