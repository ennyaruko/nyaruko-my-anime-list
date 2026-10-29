import { unified } from "unified";
import rehypeRaw from "rehype-raw";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import { it, vi, expect, describe } from "vitest";

import { createGistEndpointResolver } from "../src/shared/lib/remote-endpoints";
import { createFallbackTranslationService } from "../src/app/integrations/translation/fallback-translation-service";
import {
  splitMyMemoryText,
  createMyMemoryTranslationService,
} from "../src/app/integrations/mymemory/translation-service";
import {
  sanitizeSchema,
  getContentTexts,
  normalizeMarkdown,
  replaceTranslatedText,
} from "../src/shared/lib/content-markup";
import {
  splitTranslationText,
  createGoogleTranslationService,
} from "../src/app/integrations/google-translate/translation-service";

describe("translation markup", () => {
  it("extracts prose but not URLs, images, embedded styles or code", () => {
    const source =
      "<style>.hide {color:red}</style><h2>Review</h2>\n\nHello **world** [link](https://example.com/a_b) ![poster](https://example.com/a_b_c.jpg) `do_not_translate`";
    const texts = getContentTexts(source, "review");
    expect(texts).toContain("Review");
    expect(texts).toContain("world");
    expect(texts).toContain("link");
    expect(texts.join("")).not.toMatch(
      /https:|poster|do_not_translate|color:red/,
    );
    expect(normalizeMarkdown(source, "review")).toContain(
      "![poster](https://example.com/a_b_c.jpg)",
    );
  });

  it("replaces only text and never interprets translated HTML as markup", () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, sanitizeSchema)
      .use(
        replaceTranslatedText({
          code: "changed",
          Hello: '<img src="evil" onerror="alert(1)">',
        }),
      );
    const tree = processor.runSync(
      processor.parse(
        '<p align="center"><a href="https://example.com">Hello</a><img src="https://example.com/img.jpg" /><code>code</code></p>',
      ),
    );
    const serialized = JSON.stringify(tree);
    expect(serialized).toContain('"href":"https://example.com"');
    expect(serialized).toContain('"src":"https://example.com/img.jpg"');
    expect(serialized).toContain('"align":"center"');
    expect(serialized).toContain('"value":"code"');
    expect(serialized).not.toContain('"src":"evil"');
    expect(serialized).toContain('"type":"text","value":"<img');
  });
});

describe("Gist endpoint resolver", () => {
  const gistUrl =
    "https://gist.githubusercontent.com/user/123/raw/app-config.json";
  const defaultTranslation = "https://default.example/translate";
  const defaults = {
    translation: { fallbacks: [], default: btoa(defaultTranslation) },
  };
  const encodeEndpoint = (
    endpoint: string | { default: string; fallbacks: string[] },
  ) =>
    typeof endpoint === "string"
      ? btoa(endpoint)
      : {
          default: btoa(endpoint.default),
          fallbacks: endpoint.fallbacks.map((fallback) => btoa(fallback)),
        };
  const encodedManifest = (
    endpoints: Record<
      string,
      string | { default: string; fallbacks: string[] }
    >,
  ) => ({
    version: 2,
    encoding: "base64",
    endpoints: Object.fromEntries(
      Object.entries(endpoints).map(([name, value]) => [
        name,
        encodeEndpoint(value),
      ]),
    ),
  });
  it("deduplicates config requests and resolves arbitrary named URLs", async () => {
    const fetcher = vi.fn(async () =>
      Response.json(
        encodedManifest({
          catalog: "https://remote.example/catalog",
          translation: "https://remote.example/translate",
        }),
      ),
    );
    const resolver = createGistEndpointResolver({ gistUrl, fetcher, defaults });
    expect(
      await Promise.all([
        resolver.resolve("translation"),
        resolver.resolve("catalog"),
      ]),
    ).toEqual([
      "https://remote.example/translate",
      "https://remote.example/catalog",
    ]);
    await resolver.resolve("translation");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("resolves configured endpoint defaults and ordered fallbacks", async () => {
    const resolver = createGistEndpointResolver({
      gistUrl,
      defaults,
      fetcher: vi.fn(async () =>
        Response.json(
          encodedManifest({
            translation: {
              default: "https://google.example/translate",
              fallbacks: ["https://mymemory.example/get"],
            },
          }),
        ),
      ),
    });

    await expect(resolver.resolve("translation")).resolves.toBe(
      "https://google.example/translate",
    );
    await expect(resolver.resolveFallback("translation")).resolves.toBe(
      "https://mymemory.example/get",
    );
    await expect(resolver.resolveFallback("translation", 1)).rejects.toThrow(
      "Fallback endpoint is not configured",
    );
  });
  it("keeps the last valid configuration on errors and refreshes after TTL", async () => {
    let time = 1;
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json(
          encodedManifest({
            translation: "https://first.example/translate",
          }),
        ),
      )
      .mockResolvedValueOnce(
        Response.json(encodedManifest({ translation: "javascript:alert(1)" })),
      )
      .mockResolvedValueOnce(
        Response.json(
          encodedManifest({ translation: "https://next.example/translate" }),
        ),
      );
    const resolver = createGistEndpointResolver({
      gistUrl,
      fetcher,
      defaults,
      ttlMs: 100,
      now: () => time,
    });
    expect(await resolver.resolve("translation")).toContain("first.example");
    time += 101;
    expect(await resolver.resolve("translation")).toContain("first.example");
    time += 101;
    expect(await resolver.resolve("translation")).toContain("next.example");
  });
  it("uses defaults without a Gist or on first-load failure and rejects missing entries", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("Offline");
    });
    const local = createGistEndpointResolver({ fetcher, defaults });
    expect(await local.resolve("translation")).toBe(defaultTranslation);
    expect(fetcher).not.toHaveBeenCalled();
    const remote = createGistEndpointResolver({ gistUrl, fetcher, defaults });
    expect(await remote.resolve("translation")).toBe(defaultTranslation);
    await expect(remote.resolve("missing")).rejects.toThrow("not configured");
  });
  it("allows a null default when an endpoint is fallback-only", async () => {
    const resolver = createGistEndpointResolver({
      defaults: {
        getMalId: {
          default: null,
          fallbacks: [btoa("https://animeapi.example/anilist/:anilistId")],
        },
      },
    });

    await expect(resolver.resolveFallback("getMalId")).resolves.toBe(
      "https://animeapi.example/anilist/:anilistId",
    );
    await expect(resolver.resolve("getMalId")).rejects.toThrow(
      "Endpoint default is not configured",
    );
  });
  it("rejects unsafe remote endpoints", async () => {
    const fetcher = vi.fn(async () =>
      Response.json(
        encodedManifest({
          translation: "https://user:password@example.com",
        }),
      ),
    );
    expect(
      await createGistEndpointResolver({ gistUrl, fetcher, defaults }).resolve(
        "translation",
      ),
    ).toBe(defaultTranslation);
  });
});

describe("translation provider", () => {
  const endpoints = { resolve: async () => "https://translate.example/single" };
  it("splits long Unicode texts without losing characters or exceeding the URL budget", () => {
    const text = "Long English sentence. 葬送のフリーレン Привет 🌍\n".repeat(
      300,
    );
    const chunks = splitTranslationText(text);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toBe(text);
    expect(
      chunks.every((chunk) => encodeURIComponent(chunk).length <= 4_500),
    ).toBe(true);
  });
  it("splits MyMemory queries at its 500-byte limit without losing Unicode text", () => {
    const text = "Привет 🌍 Japanese 日本語\n".repeat(60);
    const chunks = splitMyMemoryText(text);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toBe(text);
    expect(
      chunks.every((chunk) => new TextEncoder().encode(chunk).length <= 500),
    ).toBe(true);
  });
  it("uses the resolved URL, autodetects source language and preserves surrounding spaces", async () => {
    const fetcher = vi.fn(async () => Response.json([[["Привет", "Hello"]]]));
    const service = createGoogleTranslationService(endpoints, fetcher);
    expect(
      await service.translate(
        [" Hello ", " Hello "],
        new AbortController().signal,
      ),
    ).toEqual({ " Hello ": " Привет " });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const url = new URL(String(fetcher.mock.calls[0][0]));
    expect(url.origin).toBe("https://translate.example");
    expect(url.searchParams.get("sl")).toBe("auto");
    expect(url.searchParams.get("tl")).toBe("ru");
    expect(url.searchParams.get("q")).toBe("Hello");
  });
  it("stops cancelled work before sending text", async () => {
    const fetcher = vi.fn();
    const controller = new AbortController();
    controller.abort();
    await expect(
      createGoogleTranslationService(endpoints, fetcher).translate(
        ["Hello"],
        controller.signal,
      ),
    ).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("keeps fallback orchestration provider-agnostic", async () => {
    const primary = {
      translate: vi.fn(async () => {
        throw new Error("Primary provider is unavailable");
      }),
    };
    const fallback = {
      translate: vi.fn(async (texts: readonly string[]) => ({
        [texts[0]]: "Привет",
      })),
    };
    const service = createFallbackTranslationService([primary, fallback]);

    await expect(
      service.translate(["Hello"], new AbortController().signal),
    ).resolves.toEqual({ Hello: "Привет" });
    expect(primary.translate).toHaveBeenCalledOnce();
    expect(fallback.translate).toHaveBeenCalledOnce();
  });
  it("MyMemory adapter uses its own request and response format", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        responseStatus: 200,
        responseData: { match: 1, translatedText: "Привет" },
      }),
    );
    const service = createMyMemoryTranslationService(
      {
        resolveFallback: async () => "https://api.mymemory.translated.net/get",
      },
      fetcher,
    );

    await expect(
      service.translate([" Hello "], new AbortController().signal),
    ).resolves.toEqual({ " Hello ": " Привет " });
    const url = new URL(String(fetcher.mock.calls[0][0]));
    expect(url.searchParams.get("q")).toBe("Hello");
    expect(url.searchParams.get("langpair")).toBe("autodetect|ru");
    expect(url.searchParams.get("mt")).toBe("1");
  });
  it("falls back from Google to MyMemory through the provider-agnostic service", async () => {
    const google = createGoogleTranslationService(
      { resolve: async () => "https://translate.example/single" },
      vi.fn(async () => new Response("", { status: 503 })),
    );
    const myMemoryFetch = vi.fn(async () =>
      Response.json({
        responseStatus: 200,
        responseData: { match: 1, translatedText: "Привет" },
      }),
    );
    const myMemory = createMyMemoryTranslationService(
      {
        resolveFallback: async () => "https://api.mymemory.translated.net/get",
      },
      myMemoryFetch,
    );
    const service = createFallbackTranslationService([google, myMemory]);

    await expect(
      service.translate(["Hello"], new AbortController().signal),
    ).resolves.toEqual({ Hello: "Привет" });
    expect(myMemoryFetch).toHaveBeenCalledOnce();
  });
  it("rejects rate-limit errors and malformed responses so the UI can retain the original", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 429 }))
      .mockResolvedValueOnce(Response.json({ unexpected: true }));
    const service = createGoogleTranslationService(endpoints, fetcher);
    await expect(
      service.translate(["Hello"], new AbortController().signal),
    ).rejects.toThrow("429");
    await expect(
      service.translate(["Hello"], new AbortController().signal),
    ).rejects.toThrow("Invalid translation");
  });
  it("limits concurrent requests across multiple reviews", async () => {
    let active = 0;
    let maximum = 0;
    const fetcher = vi.fn(async () => {
      active++;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active--;
      return Response.json([[["Перевод"]]]);
    });
    const service = createGoogleTranslationService(endpoints, fetcher);
    await Promise.all(
      Array.from({ length: 5 }, () =>
        service.translate(["First", "Second"], new AbortController().signal),
      ),
    );
    expect(maximum).toBe(2);
    expect(fetcher).toHaveBeenCalledTimes(10);
  });
});
