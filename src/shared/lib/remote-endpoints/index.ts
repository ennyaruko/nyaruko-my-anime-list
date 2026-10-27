import { z } from "zod";

const httpsUrl = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  }, "Expected an HTTPS URL without credentials");

const manifestSchema = z.object({
  version: z.literal(1),
  endpoints: z.record(httpsUrl),
});

export type EndpointResolver = { resolve: (name: string) => Promise<string> };

type ResolverOptions = {
  ttlMs?: number;
  gistUrl?: string;
  now?: () => number;
  fetcher?: typeof fetch;
  defaults: Record<string, string>;
};

/** Resolves named endpoints from a versioned raw Gist, retaining the last valid manifest. */
export function createGistEndpointResolver({
  gistUrl,
  defaults,
  now = Date.now,
  fetcher = fetch,
  ttlMs = 10 * 60_000,
}: ResolverOptions): EndpointResolver {
  const fallback = z.record(httpsUrl).parse(defaults);
  if (gistUrl) {
    const url = new URL(httpsUrl.parse(gistUrl));
    if (
      url.hostname !== "gist.githubusercontent.com" ||
      !url.pathname.includes("/raw/")
    ) {
      throw new Error("Configuration must use a raw GitHub Gist URL");
    }
  }
  let remote: Record<string, string> = {};
  let refreshAt = 0;
  let pending: undefined | Promise<void>;

  async function refresh() {
    try {
      const response = await fetcher(gistUrl!, {
        cache: "no-cache",
        credentials: "omit",
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok)
        throw new Error(`Gist request failed: ${response.status}`);
      const text = await response.text();
      if (text.length > 65_536)
        throw new Error("Gist configuration is too large");
      remote = manifestSchema.parse(JSON.parse(text)).endpoints;
      refreshAt = now() + ttlMs;
    } catch {
      // Offline, invalid JSON and unsupported versions retain the last valid URLs.
      refreshAt = now() + Math.min(ttlMs, 30_000);
    }
  }

  return {
    async resolve(name) {
      if (gistUrl && now() >= refreshAt) {
        pending ??= refresh().finally(() => {
          pending = undefined;
        });
        await pending;
      }
      const value = Object.hasOwn(remote, name)
        ? remote[name]
        : Object.hasOwn(fallback, name)
          ? fallback[name]
          : undefined;
      if (!value) throw new Error(`Endpoint is not configured: ${name}`);
      return value;
    },
  };
}
