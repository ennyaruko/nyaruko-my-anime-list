import type { MediaDetail, MediaScreenshotsService } from "@/entities/media";

export function createFallbackMediaScreenshotsService(
  primary: MediaScreenshotsService,
  fallback: MediaScreenshotsService,
): MediaScreenshotsService {
  return {
    async getScreenshots(detail: MediaDetail, signal) {
      const screenshots = await primary.getScreenshots(detail, signal);
      if (screenshots.length > 0 || signal?.aborted) return screenshots;

      try {
        return await fallback.getScreenshots(detail, signal);
      } catch (error) {
        if (signal?.aborted) throw error;
        return [];
      }
    },
  };
}
