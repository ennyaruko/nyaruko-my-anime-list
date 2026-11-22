import type {
  MediaDetail,
  MediaScreenshot,
  MediaExternalIdResolver,
  MediaScreenshotsService,
} from "@/entities/media";

import type { EndpointResolver } from "@/shared/lib/remote-endpoints";

const shikimoriHost = atob("aHR0cHM6Ly9zaGlraW1vcmkuaW8=");

type ScreenshotResponse = {
  preview?: unknown;
  original?: unknown;
};

function isRecord(value: unknown): value is ScreenshotResponse {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeImageUrl(value: unknown): null | string {
  if (typeof value !== "string" || value.length === 0) return null;
  if (value.startsWith("/")) return `${shikimoriHost}${value}`;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function parseScreenshots(payload: unknown): MediaScreenshot[] {
  if (!Array.isArray(payload)) return [];

  return payload.flatMap((value) => {
    if (!isRecord(value)) return [];
    const original = normalizeImageUrl(value.original ?? value.preview);
    const preview = normalizeImageUrl(value.preview ?? value.original);
    return original && preview ? [{ preview, original }] : [];
  });
}

/** Loads Shikimori screenshot URLs, using the reusable external-ID resolver. */
export function createShikimoriMediaScreenshotsService(
  endpoints: EndpointResolver,
  externalIds: MediaExternalIdResolver,
  fetcher: typeof fetch = fetch,
  yummyani: MediaScreenshotsService = { getScreenshots: async () => [] },
): MediaScreenshotsService {
  return {
    async getScreenshots(detail: MediaDetail, signal) {
      try {
        const targets = await endpoints.resolveTargets("screenshots");
        let shikimoriId: null | number = null;
        for (const target of targets) {
          if (target.type === "provider") {
            try {
              const screenshots = await yummyani.getScreenshots(detail, signal);
              if (screenshots.length > 0) return screenshots;
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

            const screenshots = parseScreenshots(await response.json());
            if (screenshots.length > 0) return screenshots;
          } catch (error) {
            if (signal?.aborted) throw error;
          }
        }
        return [];
      } catch (error) {
        if (signal?.aborted) throw error;
        return [];
      }
    },
  };
}
