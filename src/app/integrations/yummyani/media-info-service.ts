import type { MediaDetail, MediaShikimoriInfoService } from "@/entities/media";

import type { YummyApiConfig } from "./client";
import { createYummyService } from "./service";

export function createYummyMediaInfoService(
  config: YummyApiConfig,
  fetcher: typeof fetch = fetch,
): MediaShikimoriInfoService {
  const yummy = createYummyService(config, fetcher);
  return {
    getInfo(detail: MediaDetail, signal) {
      return yummy.getMediaInfo(detail, signal ?? new AbortController().signal);
    },
  };
}
