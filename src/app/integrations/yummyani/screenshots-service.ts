import type { MediaDetail, MediaScreenshotsService } from "@/entities/media";

import type { YummyApiConfig } from "./client";
import { createYummyService } from "./service";

export function createYummyMediaScreenshotsService(
  yummyConfig: YummyApiConfig,
  fetcher: typeof fetch = fetch,
): MediaScreenshotsService {
  const yummy = createYummyService(yummyConfig, fetcher);
  return {
    getScreenshots(detail: MediaDetail, signal) {
      return yummy.getScreenshots(
        detail,
        signal ?? new AbortController().signal,
      );
    },
  };
}
