import { createServiceToken } from "@/shared/lib";

/** A Shikimori screenshot with a small carousel preview and original image. */
export type MediaScreenshot = {
  preview: string;
  original: string;
};

export type MediaScreenshotsService = {
  getScreenshots(
    aniListId: number,
    fallbackMalId?: null | number,
    signal?: AbortSignal,
  ): Promise<MediaScreenshot[]>;
};

export const mediaScreenshotsServiceToken =
  createServiceToken<MediaScreenshotsService>("mediaScreenshotsService");
