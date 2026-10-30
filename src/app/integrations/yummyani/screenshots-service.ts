import type { MediaDetail, MediaScreenshotsService } from "@/entities/media";

import type { RemoteConfigResolver } from "@/shared/lib/remote-endpoints";

import { createYummyService } from "./service";

export function createYummyMediaScreenshotsService(
  config: RemoteConfigResolver,
  fetcher: typeof fetch = fetch,
): MediaScreenshotsService {
  const yummy = createYummyService(config, fetcher);
  return {
    getScreenshots(detail: MediaDetail, signal) {
      return yummy.getScreenshots(
        detail,
        signal ?? new AbortController().signal,
      );
    },
  };
}
