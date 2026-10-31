import { it, expect, describe } from "vitest";

import { mapAniListMedia } from "../src/app/integrations/anilist/api/media-mapper";

describe("mapAniListMedia", () => {
  it("preserves AniList's REPEATING status and progress", () => {
    const media = mapAniListMedia({
      id: 1,
      coverImage: null,
      title: { native: null, romaji: null, english: "Anime" },
      mediaListEntry: {
        id: 2,
        score: 0,
        progress: 5,
        status: "REPEATING",
      },
    } as Parameters<typeof mapAniListMedia>[0]);

    expect(media.status).toBe("REPEATING");
    expect(media.progress).toBe(5);
  });
});
