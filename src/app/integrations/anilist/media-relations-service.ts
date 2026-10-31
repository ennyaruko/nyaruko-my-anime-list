import type { MediaRelationsService } from "@/entities/media";

import { getAniListMediaRelations } from "./api/media-relations";

/** AniList adapter for media relations. */
export const aniListMediaRelationsService: MediaRelationsService = {
  getMediaRelations: getAniListMediaRelations,
};
