import { it, vi, expect, describe } from "vitest";

import { createYummyClient } from "../src/app/integrations/yummyani/client";
import { createGistEndpointResolver } from "../src/shared/lib/remote-endpoints";

describe("playback remote configuration", () => {
  it("loads public values and endpoints with one shared Gist request", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            version: 2,
            encoding: "base64",
            values: { yummyApplication: btoa("public-test") },
            endpoints: {
              yummyApi: {
                fallbacks: [],
                default: btoa("https://example.com/api/"),
              },
            },
          }),
        ),
    );
    const config = createGistEndpointResolver({
      fetcher,
      defaults: {},
      gistUrl: "https://gist.githubusercontent.com/test/123/raw/config.json",
    });
    expect(
      await Promise.all([
        config.resolve("yummyApi"),
        config.resolveValue("yummyApplication"),
      ]),
    ).toEqual(["https://example.com/api/", "public-test"]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("retains defaults when the Gist is unavailable", async () => {
    const config = createGistEndpointResolver({
      defaultValues: { yummyApplication: btoa("public-test") },
      fetcher: async () => {
        throw new Error("Offline");
      },
      gistUrl: "https://gist.githubusercontent.com/test/123/raw/config.json",
      defaults: {
        yummyApi: { fallbacks: [], default: btoa("https://example.com/") },
      },
    });
    expect(await config.resolve("yummyApi")).toBe("https://example.com/");
    expect(await config.resolveValue("yummyApplication")).toBe("public-test");
  });
});

describe("Yummyani transport", () => {
  const config = createGistEndpointResolver({
    defaultValues: { yummyApplication: btoa("public-test") },
    defaults: {
      yummyApi: { fallbacks: [], default: btoa("https://example.com/") },
    },
  });
  it("sends only the public application header and unwraps the response", async () => {
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
    expect(url.searchParams.get("need_videos")).toBe("true");
    expect(options.credentials).toBe("omit");
    expect(options.headers).toEqual({
      Lang: "ru",
      Accept: "application/json",
      "X-Application": "public-test",
    });
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
import { kodikEmbedTemplate } from "../src/app/integrations/playback/embed-url";
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
