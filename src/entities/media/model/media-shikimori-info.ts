import { createServiceToken } from "@/shared/lib";

import type { MediaDetail } from "./media-detail";

export type ShikimoriAgeRating = "g" | "r" | "pg" | "rx" | "pg_13" | "r_plus";

/** Shikimori metadata used alongside AniList's media detail. */
export type MediaShikimoriInfo = {
  russianTitle: null | string;
  ageRating: null | ShikimoriAgeRating;
};

export type MediaShikimoriInfoService = {
  getInfo(
    detail: MediaDetail,
    signal?: AbortSignal,
  ): Promise<MediaShikimoriInfo>;
};

export const mediaShikimoriInfoServiceToken =
  createServiceToken<MediaShikimoriInfoService>("mediaShikimoriInfoService");
