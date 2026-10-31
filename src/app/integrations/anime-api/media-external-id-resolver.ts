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

/** Uses AniList's MAL ID first and queries AnimeAPI only when it is missing. */
export function createAnimeApiMediaExternalIdResolver(
  endpoints: EndpointResolver,
  fetcher: typeof fetch = fetch,
): MediaExternalIdResolver {
  return {
    async resolve(aniListId, fallbackMalId = null, signal) {
      const malId = readId(fallbackMalId);
      if (malId) return { malId, shikimoriId: malId };

      try {
        const endpoint = await endpoints.resolveFallback("getMalId");
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

        const resolvedMalId =
          readId(payload.myanimelist) ??
          readId(payload.malId) ??
          readId(payload.shikimori);

        return {
          malId: resolvedMalId,
          shikimoriId: readId(payload.shikimori) ?? resolvedMalId,
        };
      } catch (error) {
        if (signal?.aborted) throw error;
        return { malId: null, shikimoriId: null };
      }
    },
  };
}
