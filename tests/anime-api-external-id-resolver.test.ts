import { it, vi, expect, describe } from "vitest";

import { createAnimeApiMediaExternalIdResolver } from "../src/app/integrations/anime-api/media-external-id-resolver";

describe("createAnimeApiMediaExternalIdResolver", () => {
  const endpoint = atob(
    "aHR0cHM6Ly9hbmltZWFwaS5teS5pZC9hbmlsaXN0LzphbmlsaXN0SWQ=",
  );

  it("uses AniList's MAL ID without requesting AnimeAPI", async () => {
    const endpoints = {
      resolveFallback: vi.fn().mockResolvedValue(endpoint),
    };
    const fetcher = vi.fn();
    const resolver = createAnimeApiMediaExternalIdResolver(
      endpoints,
      fetcher,
    );

    await expect(resolver.resolve(145728, 51122)).resolves.toEqual({
      malId: 51122,
      shikimoriId: 51122,
    });
    expect(fetcher).not.toHaveBeenCalled();
    expect(endpoints.resolveFallback).not.toHaveBeenCalled();
  });

  it("uses AnimeAPI only when AniList has no MAL ID", async () => {
    const endpoints = {
      resolveFallback: vi.fn().mockResolvedValue(endpoint),
    };
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({ shikimori: 51122, myanimelist: 51122 }),
    );
    const resolver = createAnimeApiMediaExternalIdResolver(
      endpoints,
      fetcher,
    );

    await expect(resolver.resolve(145728, null)).resolves.toEqual({
      malId: 51122,
      shikimoriId: 51122,
    });
    expect(endpoints.resolveFallback).toHaveBeenCalledWith("getMalId");
    expect(fetcher).toHaveBeenCalledWith(
      endpoint.replace(":anilistId", "145728"),
      expect.objectContaining({ credentials: "omit" }),
    );
  });

  it("returns missing IDs when AnimeAPI fallback fails", async () => {
    const endpoints = {
      resolveFallback: vi.fn().mockResolvedValue(endpoint),
    };
    const fetcher = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    const resolver = createAnimeApiMediaExternalIdResolver(
      endpoints,
      fetcher,
    );

    await expect(resolver.resolve(145728)).resolves.toEqual({
      malId: null,
      shikimoriId: null,
    });
  });
});
