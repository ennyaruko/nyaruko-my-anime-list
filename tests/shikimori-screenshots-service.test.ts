import { it, vi, expect, describe } from "vitest";

import { createShikimoriMediaScreenshotsService } from "../src/app/integrations/shikimori/media-screenshots-service";

describe("createShikimoriMediaScreenshotsService", () => {
  it("uses the resolved Shikimori ID and normalizes relative image paths", async () => {
    const endpoints = {
      resolve: vi
        .fn()
        .mockResolvedValue(
          "https://shikimori.io/api/animes/:shikimoriId/screenshots",
        ),
    };
    const externalIds = {
      resolve: vi
        .fn()
        .mockResolvedValue({ malId: 54000, shikimoriId: 54000 }),
    };
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            preview: "/system/screenshots/preview/frame.jpg?1",
            original: "/system/screenshots/original/frame.jpg?1",
          },
        ]),
        { status: 200 },
      ),
    );
    const service = createShikimoriMediaScreenshotsService(
      endpoints,
      externalIds,
      fetcher,
    );

    await expect(service.getScreenshots(159309, 54000)).resolves.toEqual([
      {
        preview: "https://shikimori.io/system/screenshots/preview/frame.jpg?1",
        original: "https://shikimori.io/system/screenshots/original/frame.jpg?1",
      },
    ]);
    expect(fetcher).toHaveBeenCalledWith(
      "https://shikimori.io/api/animes/54000/screenshots",
      expect.objectContaining({ credentials: "omit" }),
    );
  });
});
