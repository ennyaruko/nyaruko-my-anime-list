import { it, expect, describe } from "vitest";

import { getMediaScreenshotImages } from "../src/pages/media-detail/model/get-media-screenshot-images";

describe("getMediaScreenshotImages", () => {
  it("keeps the AniList banner when Shikimori has no screenshots", () => {
    expect(
      getMediaScreenshotImages(
        { title: "Anime", bannerImage: "https://example.com/banner.jpg" },
        [],
      ),
    ).toEqual([
      {
        title: "Anime",
        preview: "https://example.com/banner.jpg",
        original: "https://example.com/banner.jpg",
      },
    ]);
  });

  it("puts the banner first and removes a duplicate Shikimori image", () => {
    expect(
      getMediaScreenshotImages(
        { title: "Anime", bannerImage: "https://example.com/banner.jpg" },
        [
          {
            preview: "https://example.com/preview.jpg",
            original: "https://example.com/screenshot.jpg",
          },
          {
            original: "https://example.com/banner.jpg",
            preview: "https://example.com/banner-preview.jpg",
          },
        ],
      ).map(({ original }) => original),
    ).toEqual([
      "https://example.com/banner.jpg",
      "https://example.com/screenshot.jpg",
    ]);
  });
});
