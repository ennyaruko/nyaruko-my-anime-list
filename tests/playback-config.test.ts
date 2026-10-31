import { it, vi, expect, describe } from "vitest";

import { createYummyClient } from "../src/app/integrations/yummyani/client";
import { kodikEmbedTemplate } from "../src/app/integrations/playback/embed-url";
import { createGistEndpointResolver } from "../src/shared/lib/remote-endpoints";

describe("Gist endpoint configuration", () => {
  it("loads endpoints from the Gist", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            version: 2,
            encoding: "base64",
            endpoints: {
              translation: {
                fallbacks: [],
                default: btoa("https://example.com/translate"),
              },
            },
          }),
        ),
    );
    const config = createGistEndpointResolver({
      fetcher,
      gistUrl: "https://gist.githubusercontent.com/test/123/raw/config.json",
    });

    await expect(config.resolve("translation")).resolves.toBe(
      "https://example.com/translate",
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("does not use embedded endpoints when the Gist is unavailable", async () => {
    const config = createGistEndpointResolver({
      fetcher: async () => {
        throw new Error("Offline");
      },
      gistUrl: "https://gist.githubusercontent.com/test/123/raw/config.json",
    });

    await expect(config.resolve("translation")).rejects.toThrow(
      "Endpoint default is not configured",
    );
  });
});

describe("Yummyani transport", () => {
  const config = {
    apiUrl: "https://example.com/api/",
    applicationToken: "test-application",
  };

  it("sends the application header and unwraps the response", async () => {
    const fetcher = vi.fn(
      async () => new Response(JSON.stringify({ response: { anime_id: 1 } })),
    );
    const request = createYummyClient(config, fetcher);
    expect(
      await request(
        "anime/1",
        { need_videos: "true" },
        new AbortController().signal,
      ),
    ).toEqual({ anime_id: 1 });
    const [url, options] = fetcher.mock.calls[0] as unknown as [
      URL,
      RequestInit,
    ];
    expect(url.href).toBe("https://example.com/api/anime/1?need_videos=true");
    expect(options.credentials).toBe("omit");
    expect(options.headers).toEqual({
      Lang: "ru",
      Accept: "application/json",
      "X-Application": "test-application",
    });
  });

  it("requires the configured API URL and application token", async () => {
    const signal = new AbortController().signal;
    const fetcher = vi.fn();
    await expect(
      createYummyClient({ ...config, applicationToken: "" }, fetcher)(
        "anime/1",
        {},
        signal,
      ),
    ).rejects.toThrow("VITE_YUMMY_APPLICATION is not configured");
    await expect(
      createYummyClient({ ...config, apiUrl: "" }, fetcher)(
        "anime/1",
        {},
        signal,
      ),
    ).rejects.toThrow("VITE_YUMMY_API is not configured");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("propagates outages and rejects malformed data for the page fallback", async () => {
    const signal = new AbortController().signal;
    await expect(
      createYummyClient(config, async () => new Response("", { status: 503 }))(
        "anime/1",
        {},
        signal,
      ),
    ).rejects.toMatchObject({ status: 503 });
    await expect(
      createYummyClient(config, async () => new Response("{}"))(
        "anime/1",
        {},
        signal,
      ),
    ).rejects.toThrow("Invalid Yummyani response");
  });

  it("does not send requests after cancellation", async () => {
    const fetcher = vi.fn();
    const controller = new AbortController();
    controller.abort();
    await expect(
      createYummyClient(config, fetcher)("anime/1", {}, controller.signal),
    ).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("Kodik dimensions", () => {
  it("replaces unsupported percentage dimensions with measured size placeholders", () => {
    const template = kodikEmbedTemplate(
      "https://example.com/?shikimoriID=42&width=100%&height=100%&noEmbed",
    );
    const resolved = new URL(
      template.replaceAll(":width", "480").replaceAll(":height", "270"),
    );
    expect(resolved.searchParams.get("width")).toBe("480");
    expect(resolved.searchParams.get("height")).toBe("270");
    expect(resolved.searchParams.get("shikimoriID")).toBe("42");
    expect(resolved.searchParams.has("noEmbed")).toBe(true);
  });
});
