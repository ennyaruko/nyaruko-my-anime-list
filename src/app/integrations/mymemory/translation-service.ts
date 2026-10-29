import type { TranslationService } from "@/features/translate-content";

import type { EndpointResolver } from "@/shared/lib/remote-endpoints";

const MAX_QUERY_BYTES = 500;

export function splitMyMemoryText(text: string): string[] {
  const chunks: string[] = [];
  let rest = text;

  while (rest) {
    let byteLength = 0;
    let end = 0;
    let boundary = 0;

    for (const char of rest) {
      const charBytes = new TextEncoder().encode(char).length;
      if (byteLength + charBytes > MAX_QUERY_BYTES) break;
      byteLength += charBytes;
      end += char.length;
      if (/\s/u.test(char)) boundary = end;
    }

    if (!end) throw new Error("MyMemory query size is too small");
    if (end < rest.length && boundary > end / 2) end = boundary;
    chunks.push(rest.slice(0, end));
    rest = rest.slice(end);
  }

  return chunks;
}

function parseTranslation(data: unknown): string {
  if (
    typeof data !== "object" ||
    data === null ||
    !("responseStatus" in data) ||
    data.responseStatus !== 200 ||
    !("responseData" in data) ||
    typeof data.responseData !== "object" ||
    data.responseData === null ||
    !("translatedText" in data.responseData) ||
    typeof data.responseData.translatedText !== "string" ||
    !data.responseData.translatedText.trim()
  ) {
    throw new Error("Invalid MyMemory translation response");
  }

  return data.responseData.translatedText;
}

export function createMyMemoryTranslationService(
  endpoints: Pick<EndpointResolver, "resolveFallback">,
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
        throw new Error(`MyMemory request failed: ${response.status}`);
      return parseTranslation(await response.json());
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active--;
    }
  }

  return {
    async translate(texts, signal) {
      const endpoint = await endpoints.resolveFallback("translation");
      signal.throwIfAborted();
      const translations: [string, string][] = [];

      for (const text of new Set(texts)) {
        const translated: string[] = [];
        for (const chunk of splitMyMemoryText(text)) {
          signal.throwIfAborted();
          const trimmed = chunk.trim();
          if (!trimmed) {
            translated.push(chunk);
            continue;
          }

          const url = new URL(endpoint);
          url.searchParams.set("q", trimmed);
          url.searchParams.set("langpair", "autodetect|ru");
          url.searchParams.set("mt", "1");
          const result = await request(url, signal);
          translated.push(
            (chunk.match(/^\s*/u)?.[0] ?? "") +
              result +
              (chunk.match(/\s*$/u)?.[0] ?? ""),
          );
        }
        translations.push([text, translated.join("")]);
      }

      return Object.fromEntries(translations);
    },
  };
}
