import type {
  MediaDetail,
  MediaShikimoriInfo,
  ShikimoriAgeRating,
  MediaExternalIdResolver,
  MediaShikimoriInfoService,
} from "@/entities/media";

import type { EndpointResolver } from "@/shared/lib/remote-endpoints";

const ageRatings = new Set<ShikimoriAgeRating>([
  "g",
  "pg",
  "pg_13",
  "r",
  "r_plus",
  "rx",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseInfo(payload: unknown): MediaShikimoriInfo {
  if (!isRecord(payload)) return { ageRating: null, russianTitle: null };

  const russianTitle =
    typeof payload.russian === "string" && payload.russian.trim()
      ? payload.russian.trim()
      : null;
  const ageRating =
    typeof payload.rating === "string" &&
    ageRatings.has(payload.rating as ShikimoriAgeRating)
      ? (payload.rating as ShikimoriAgeRating)
      : null;

  return { ageRating, russianTitle };
}

/** Fetches Shikimori's Russian title and age rating through the configured proxy. */
export function createShikimoriMediaInfoService(
  endpoints: EndpointResolver,
  externalIds: MediaExternalIdResolver,
  yummyani: MediaShikimoriInfoService,
  fetcher: typeof fetch = fetch,
): MediaShikimoriInfoService {
  return {
    async getInfo(detail: MediaDetail, signal) {
      try {
        const targets = await endpoints.resolveTargets("shikimoriAnime");
        let info: MediaShikimoriInfo = {
          ageRating: null,
          russianTitle: null,
        };

        let shikimoriId: null | number = null;
        for (const target of targets) {
          if (target.type === "provider") {
            try {
              const fallbackInfo = await yummyani.getInfo(detail, signal);
              info = {
                ageRating: info.ageRating ?? fallbackInfo.ageRating,
                russianTitle: info.russianTitle ?? fallbackInfo.russianTitle,
              };
              if (info.ageRating && info.russianTitle) return info;
            } catch (error) {
              if (signal?.aborted) throw error;
            }
            continue;
          }

          if (shikimoriId === null) {
            try {
              shikimoriId = (
                await externalIds.resolve(detail.media.id, detail.malId, signal)
              ).shikimoriId;
            } catch (error) {
              if (signal?.aborted) throw error;
              continue;
            }
            if (!shikimoriId) continue;
          }
          try {
            const url = target.url.replace(":shikimoriId", String(shikimoriId));
            const response = await fetcher(url, {
              signal,
              credentials: "omit",
            });
            if (!response.ok) continue;

            const nextInfo = parseInfo(await response.json());
            info = {
              ageRating: info.ageRating ?? nextInfo.ageRating,
              russianTitle: info.russianTitle ?? nextInfo.russianTitle,
            };
            if (info.ageRating && info.russianTitle) return info;
          } catch (error) {
            if (signal?.aborted) throw error;
          }
        }

        return info;
      } catch (error) {
        if (signal?.aborted) throw error;
        return { ageRating: null, russianTitle: null };
      }
    },
  };
}
