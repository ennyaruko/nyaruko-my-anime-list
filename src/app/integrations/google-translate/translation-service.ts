import type { TranslationService } from "@/features/translate-content";

import type { EndpointResolver } from "@/shared/lib/remote-endpoints";

/** Keep the encoded query below typical URL limits, splitting at word boundaries. */
export function splitTranslationText(text: string, maxBytes = 4_500): string[] {
  const chunks: string[] = [];
  let rest = text;
  while (rest) {
    let length = 0;
    let end = 0;
    let boundary = 0;
    for (const char of rest) {
      const bytes = encodeURIComponent(char).length;
      if (length + bytes > maxBytes) break;
      length += bytes;
      end += char.length;
      if (/\s/u.test(char)) boundary = end;
    }
    if (!end) throw new Error("Translation chunk size is too small");
    if (end < rest.length && boundary > end / 2) end = boundary;
    chunks.push(rest.slice(0, end));
    rest = rest.slice(end);
  }
  return chunks;
}

function parseTranslation(data: unknown): string {
  if (!Array.isArray(data) || !Array.isArray(data[0]) || data[0].length === 0) {
    throw new Error("Invalid translation response");
  }
  return data[0]
    .map((part: unknown) => {
      if (!Array.isArray(part) || typeof part[0] !== "string") {
        throw new Error("Invalid translation segment");
      }
      return part[0];
    })
    .join("");
}

/** Provider-specific request format stays outside the translation feature. */
export function createGoogleTranslationService(
  endpoints: Pick<EndpointResolver, "resolve">,
  fetcher: typeof fetch = fetch,
): TranslationService {
  let active = 0;
  const waiting: (() => void)[] = [];

  async function request(url: URL, signal: AbortSignal) {
    if (active >= 2)
      await new Promise<void>((resolve) => waiting.push(resolve));
    else active++;
    try {
      signal.throwIfAborted();
      const response = await fetcher(url, {
        credentials: "omit",
        signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
      });
      if (!response.ok)
        throw new Error(`Translation request failed: ${response.status}`);
      return parseTranslation(await response.json());
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active--;
    }
  }

  return {
    async translate(texts, signal) {
      const endpoint = await endpoints.resolve("translation");
      signal.throwIfAborted();
      const entries: [string, string][] = [];
      for (const text of new Set(texts)) {
        const translated: string[] = [];
        for (const chunk of splitTranslationText(text)) {
          signal.throwIfAborted();
          const trimmed = chunk.trim();
          if (!trimmed) {
            translated.push(chunk);
            continue;
          }
          const url = new URL(endpoint);
          for (const [key, value] of Object.entries({
            dt: "t",
            tl: "ru",
            sl: "auto",
            q: trimmed,
            client: "gtx",
          })) {
            url.searchParams.set(key, value);
          }
          const result = await request(url, signal);
          if (!result.trim()) throw new Error("Translation is empty");
          translated.push(
            (chunk.match(/^\s*/u)?.[0] ?? "") +
              result +
              (chunk.match(/\s*$/u)?.[0] ?? ""),
          );
        }
        entries.push([text, translated.join("")]);
      }
      return Object.fromEntries(entries);
    },
  };
}
