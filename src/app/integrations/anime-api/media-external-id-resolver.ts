import type { MediaExternalIdResolver } from "@/entities/media";

import type { EndpointResolver } from "@/shared/lib/remote-endpoints";

function readId(value: unknown): null | number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Resolves external catalog IDs, falling back to AniList's own MAL ID. */
export function createAnimeApiMediaExternalIdResolver(
  endpoints: EndpointResolver,
  fetcher: typeof fetch = fetch,
): MediaExternalIdResolver {
  return {
    async resolve(aniListId, fallbackMalId = null, signal) {
      const safeFallback = readId(fallbackMalId);

      try {
        const endpoint = await endpoints.resolve("animeApiAniList");
        const url = endpoint.replace(":anilistId", String(aniListId));
        const response = await fetcher(url, {
          signal,
          credentials: "omit",
        });
        if (!response.ok)
          throw new Error(`AnimeAPI request failed: ${response.status}`);

        const payload: unknown = await response.json();
        if (!isRecord(payload))
          throw new Error("AnimeAPI returned invalid data.");

        const malId =
          readId(payload.myanimelist) ?? readId(payload.malId) ?? safeFallback;

        return {
          malId,
          shikimoriId: readId(payload.shikimori) ?? malId ?? safeFallback,
        };
      } catch (error) {
        if (signal?.aborted) throw error;
        return { malId: safeFallback, shikimoriId: safeFallback };
      }
    },
  };
}
