import { unified } from "unified";
import rehypeRaw from "rehype-raw";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import { it, vi, expect, describe } from "vitest";

import { createGistEndpointResolver } from "../src/shared/lib/remote-endpoints";
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
  const defaults = { translation: "https://default.example/translate" };
  it("deduplicates config requests and resolves arbitrary named URLs", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        version: 1,
        endpoints: {
          catalog: "https://remote.example/catalog",
          translation: "https://remote.example/translate",
        },
      }),
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
  it("keeps the last valid configuration on errors and refreshes after TTL", async () => {
    let time = 1;
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          version: 1,
          endpoints: { translation: "https://first.example/translate" },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          version: 2,
          endpoints: { translation: "javascript:alert(1)" },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          version: 1,
          endpoints: { translation: "https://next.example/translate" },
        }),
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
    expect(await local.resolve("translation")).toBe(defaults.translation);
    expect(fetcher).not.toHaveBeenCalled();
    const remote = createGistEndpointResolver({ gistUrl, fetcher, defaults });
    expect(await remote.resolve("translation")).toBe(defaults.translation);
    await expect(remote.resolve("missing")).rejects.toThrow("not configured");
  });
  it("rejects unsafe remote endpoints", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        version: 1,
        endpoints: { translation: "https://user:password@example.com" },
      }),
    );
    expect(
      await createGistEndpointResolver({ gistUrl, fetcher, defaults }).resolve(
        "translation",
      ),
    ).toBe(defaults.translation);
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
