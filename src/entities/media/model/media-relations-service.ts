import { createServiceToken } from "@/shared/lib";

import type { MediaRelation } from "./media-detail";

/** Application port for loading media related to a detail page. */
export type MediaRelationsService = {
  /** Loads anime related to the requested media. */
  getMediaRelations(
    accessToken: string,
    mediaId: number,
    signal?: AbortSignal,
  ): Promise<MediaRelation[]>;
};

export const mediaRelationsServiceToken =
  createServiceToken<MediaRelationsService>("mediaRelationsService");
