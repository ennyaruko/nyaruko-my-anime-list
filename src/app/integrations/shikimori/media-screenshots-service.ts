import type {
  MediaScreenshot,
  MediaExternalIdResolver,
  MediaScreenshotsService,
} from "@/entities/media";

import type { EndpointResolver } from "@/shared/lib/remote-endpoints";

type ScreenshotResponse = {
  preview?: unknown;
  original?: unknown;
};

function isRecord(value: unknown): value is ScreenshotResponse {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeImageUrl(value: unknown): null | string {
  if (typeof value !== "string" || value.length === 0) return null;
  if (value.startsWith("/")) return `https://shikimori.io${value}`;

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
): MediaScreenshotsService {
  return {
    async getScreenshots(aniListId, fallbackMalId = null, signal) {
      const ids = await externalIds.resolve(aniListId, fallbackMalId, signal);
      if (!ids.shikimoriId) return [];

      try {
        const endpoint = await endpoints.resolve("shikimoriScreenshots");
        const url = endpoint.replace(":shikimoriId", String(ids.shikimoriId));
        const response = await fetcher(url, {
          signal,
          credentials: "omit",
        });
        if (!response.ok) return [];

        return parseScreenshots(await response.json());
      } catch (error) {
        if (signal?.aborted) throw error;
        return [];
      }
    },
  };
}
