import { it, vi, expect, describe } from "vitest";

import type { MediaDetail, MediaScreenshotsService } from "../src/entities/media";
import { createFallbackMediaScreenshotsService } from "../src/app/integrations/fallback-media-screenshots-service";

describe("createFallbackMediaScreenshotsService", () => {
  const detail = { malId: 2, media: { id: 1 } } as MediaDetail;
  const frame = { original: "https://img.test/full.webp", preview: "https://img.test/preview.webp" };

  it("uses the fallback only when the primary source has no frames", async () => {
    const primary: MediaScreenshotsService = {
      getScreenshots: vi.fn().mockResolvedValue([]),
    };
    const fallback: MediaScreenshotsService = {
      getScreenshots: vi.fn().mockResolvedValue([frame]),
    };
    const service = createFallbackMediaScreenshotsService(primary, fallback);

    await expect(service.getScreenshots(detail)).resolves.toEqual([frame]);
    expect(primary.getScreenshots).toHaveBeenCalledWith(detail, undefined);
    expect(fallback.getScreenshots).toHaveBeenCalledWith(detail, undefined);
  });

  it("does not call the fallback when the primary source has frames", async () => {
    const primary: MediaScreenshotsService = {
      getScreenshots: vi.fn().mockResolvedValue([frame]),
    };
    const fallback: MediaScreenshotsService = {
      getScreenshots: vi.fn().mockResolvedValue([]),
    };
    const service = createFallbackMediaScreenshotsService(primary, fallback);

    await expect(service.getScreenshots(detail)).resolves.toEqual([frame]);
    expect(fallback.getScreenshots).not.toHaveBeenCalled();
  });
});
