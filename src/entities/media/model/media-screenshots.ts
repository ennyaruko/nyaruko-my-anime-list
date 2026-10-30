import { createServiceToken } from "@/shared/lib";

import type { MediaDetail } from "./media-detail";

/** A provider-neutral screenshot with a carousel preview and original image. */
export type MediaScreenshot = {
  preview: string;
  original: string;
};

export type MediaScreenshotsService = {
  getScreenshots(
    detail: MediaDetail,
    signal?: AbortSignal,
  ): Promise<MediaScreenshot[]>;
};

export const mediaScreenshotsServiceToken =
  createServiceToken<MediaScreenshotsService>("mediaScreenshotsService");
