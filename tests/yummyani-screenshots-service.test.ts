import { it, vi, expect, describe } from "vitest";

import type { MediaDetail } from "../src/entities/media";
import { createYummyMediaScreenshotsService } from "../src/app/integrations/yummyani/screenshots-service";

describe("createYummyMediaScreenshotsService", () => {
  it("resolves the matching anime and maps its random screenshots", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            response: [
              {
                anime_id: 7,
                title: "Example anime",
                remote_ids: { myanimelist_id: 123 },
              },
            ],
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            response: {
              anime_id: 7,
              title: "Example anime",
              random_screenshots: [
                {
                  sizes: {
                    full: "https://img.test/frame-full.avif",
                    small: "https://img.test/frame-small.webp",
                  },
                },
                { sizes: { full: "https://img.test/full-only.avif" } },
                { sizes: { small: "http://unsafe.test/frame.webp" } },
              ],
            },
          }),
          { status: 200 },
        ),
      );
    const config = {
      applicationToken: "app-token",
      apiUrl: "https://api.yani.tv/",
    };
    const service = createYummyMediaScreenshotsService(config, fetcher);
    const detail = {
      malId: 123,
      titles: ["Example anime"],
      media: {
        id: 1,
        format: "TV",
        episodes: 12,
        startDate: null,
        seasonYear: 2020,
        title: "Example anime",
      },
    } as unknown as MediaDetail;

    await expect(
      service.getScreenshots(detail, new AbortController().signal),
    ).resolves.toEqual([
      {
        preview: "https://img.test/frame-small.webp",
        original: "https://img.test/frame-full.avif",
      },
      {
        preview: "https://img.test/full-only.avif",
        original: "https://img.test/full-only.avif",
      },
    ]);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(String(fetcher.mock.calls[0][0])).toContain("mal_ids=123");
    expect(String(fetcher.mock.calls[1][0])).toContain(
      "anime/7?need_videos=false",
    );
  });
});
