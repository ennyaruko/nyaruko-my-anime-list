import { it, vi, expect, describe } from "vitest";

import { createShikimoriMediaScreenshotsService } from "../src/app/integrations/shikimori/media-screenshots-service";

describe("createShikimoriMediaScreenshotsService", () => {
  const host = atob("aHR0cHM6Ly9zaGlraW1vcmkuaW8=");
  const endpoint = atob(
    "aHR0cHM6Ly9zaGlraW1vcmkuaW8vYXBpL2FuaW1lcy86c2hpa2ltb3JpSWQvc2NyZWVuc2hvdHM=",
  );

  it("uses the resolved Shikimori ID and normalizes relative image paths", async () => {
    const endpoints = {
      resolve: vi.fn().mockResolvedValue(endpoint),
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
        preview: `${host}/system/screenshots/preview/frame.jpg?1`,
        original: `${host}/system/screenshots/original/frame.jpg?1`,
      },
    ]);
    expect(fetcher).toHaveBeenCalledWith(
      endpoint.replace(":shikimoriId", "54000"),
      expect.objectContaining({ credentials: "omit" }),
    );
  });
});
