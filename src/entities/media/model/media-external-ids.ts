import { createServiceToken } from "@/shared/lib";

/** Cross-provider identifiers associated with one AniList media record. */
export type MediaExternalIds = {
  malId: null | number;
  shikimoriId: null | number;
};

/** Reusable AniList-to-provider ID resolver for screenshots and future players. */
export type MediaExternalIdResolver = {
  resolve(
    aniListId: number,
    fallbackMalId?: null | number,
    signal?: AbortSignal,
  ): Promise<MediaExternalIds>;
};

export const mediaExternalIdResolverToken =
  createServiceToken<MediaExternalIdResolver>("mediaExternalIdResolver");
