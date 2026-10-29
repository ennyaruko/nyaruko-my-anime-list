import { it, vi, expect, describe } from "vitest";

import { createAnimeApiMediaExternalIdResolver } from "../src/app/integrations/anime-api/media-external-id-resolver";

describe("createAnimeApiMediaExternalIdResolver", () => {
  it("resolves AniList, MAL, and Shikimori IDs", async () => {
    const endpoints = {
      resolve: vi.fn().mockResolvedValue("https://animeapi.my.id/anilist/:anilistId"),
    };
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ shikimori: 51122, myanimelist: 51122 }),
        { status: 200 },
      ),
    );
    const resolver = createAnimeApiMediaExternalIdResolver(
      endpoints,
      fetcher,
    );

    await expect(resolver.resolve(145728, 51122)).resolves.toEqual({
      malId: 51122,
      shikimoriId: 51122,
    });
    expect(fetcher).toHaveBeenCalledWith(
      "https://animeapi.my.id/anilist/145728",
      expect.objectContaining({ credentials: "omit" }),
    );
  });

  it("falls back to AniList's MAL ID when AnimeAPI is unavailable", async () => {
    const endpoints = {
      resolve: vi.fn().mockResolvedValue("https://animeapi.my.id/anilist/:anilistId"),
    };
    const fetcher = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    const resolver = createAnimeApiMediaExternalIdResolver(
      endpoints,
      fetcher,
    );

    await expect(resolver.resolve(145728, 51122)).resolves.toEqual({
      malId: 51122,
      shikimoriId: 51122,
    });
  });
});
