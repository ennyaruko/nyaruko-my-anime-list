import { it, vi, expect, afterEach } from "vitest";

import { aniListMediaListActionsService } from "../src/app/integrations/anilist/media-list-actions-service";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it("sends final progress and completion in one keepalive GraphQL request", async () => {
  vi.stubEnv("VITE_ANILIST_GRAPHQL_ENDPOINT", "https://example.test/graphql");
  const fetcher = vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        data: {
          SaveMediaListEntry: {
            id: 1,
            mediaId: 10,
            progress: 12,
            status: "COMPLETED",
          },
        },
      }),
      { headers: { "Content-Type": "application/json" } },
    ),
  );
  vi.stubGlobal("fetch", fetcher);
  await aniListMediaListActionsService.updateProgress("test-token", 10, 12, {
    keepalive: true,
    status: "COMPLETED",
  });
  expect(fetcher).toHaveBeenCalledTimes(1);
  const request = fetcher.mock.calls[0][1] as RequestInit;
  expect(request.keepalive).toBe(true);
  expect(JSON.parse(request.body as string).variables).toEqual({
    mediaId: 10,
    progress: 12,
    status: "COMPLETED",
  });
});
