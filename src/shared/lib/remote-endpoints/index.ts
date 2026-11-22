import { z } from "zod";

const httpsUrl = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  }, "Expected an HTTPS URL without credentials");

const fallbackTargetSchema = z.union([
  z.string().min(1),
  z.object({ provider: z.literal("yummyani") }),
]);

const manifestSchema = z.object({
  encoding: z.literal("base64"),
  // The version is informational; the validated manifest shape defines compatibility.
  version: z.number().int().positive(),
  endpoints: z.record(
    z.union([
      z.string().min(1),
      z.object({
        default: z.string().min(1).nullable(),
        fallbacks: z.array(fallbackTargetSchema).optional(),
      }),
    ]),
  ),
});

export type EndpointConfig = {
  default: null | string;
  fallbacks?: EndpointFallback[];
};

export type EndpointFallback = string | { provider: "yummyani" };

export type EndpointTarget =
  { type: "url"; url: string } | { type: "provider"; provider: "yummyani" };

type DefaultEndpointConfig = EndpointConfig & { fallbacks: string[] };

export type EndpointResolver = {
  resolve: (name: string) => Promise<string>;
  resolveTargets: (name: string) => Promise<EndpointTarget[]>;
  resolveFallback: (name: string, index?: number) => Promise<string>;
};

export type RemoteConfigResolver = EndpointResolver;

type ResolverOptions = {
  ttlMs?: number;
  gistUrl?: string;
  now?: () => number;
  fetcher?: typeof fetch;
  defaults?: Record<string, DefaultEndpointConfig>;
};

/** Resolves named endpoints from a versioned raw Gist, retaining the last valid manifest. */
export function createGistEndpointResolver({
  gistUrl,
  defaults,
  now = Date.now,
  fetcher = fetch,
  ttlMs = 10 * 60_000,
}: ResolverOptions): RemoteConfigResolver {
  const fallback = decodeEndpoints(defaults ?? {});
  if (gistUrl) {
    const url = new URL(httpsUrl.parse(gistUrl));
    if (
      url.hostname !== "gist.githubusercontent.com" ||
      !url.pathname.includes("/raw/")
    ) {
      throw new Error("Configuration must use a raw GitHub Gist URL");
    }
  }
  let remote: Record<string, EndpointConfig> = {};
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
      const manifest = manifestSchema.parse(JSON.parse(text));
      const decodedEndpoints = decodeEndpoints(manifest.endpoints);
      remote = decodedEndpoints;
      refreshAt = now() + ttlMs;
    } catch {
      // Offline or invalid manifests retain the last valid URLs.
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
      if (!value?.default)
        throw new Error(`Endpoint default is not configured: ${name}`);
      return value.default;
    },
    async resolveFallback(name, index = 0) {
      if (gistUrl && now() >= refreshAt) {
        pending ??= refresh().finally(() => {
          pending = undefined;
        });
        await pending;
      }
      const remoteEndpoints = remote[name]?.fallbacks;
      const endpoints = remoteEndpoints ?? fallback[name]?.fallbacks ?? [];
      const endpoint = endpoints[index];
      if (!endpoint)
        throw new Error(
          `Fallback endpoint is not configured: ${name}[${index}]`,
        );
      if (typeof endpoint !== "string")
        throw new Error(
          `Fallback endpoint is a provider target: ${name}[${index}]`,
        );
      return endpoint;
    },
    async resolveTargets(name) {
      if (gistUrl && now() >= refreshAt) {
        pending ??= refresh().finally(() => {
          pending = undefined;
        });
        await pending;
      }

      const config = Object.hasOwn(remote, name)
        ? remote[name]
        : Object.hasOwn(fallback, name)
          ? fallback[name]
          : undefined;
      if (!config) throw new Error(`Endpoint is not configured: ${name}`);

      const targets: EndpointTarget[] = [
        ...(config.default
          ? [{ url: config.default, type: "url" as const }]
          : []),
        ...(config.fallbacks ?? []).map((target) =>
          typeof target === "string"
            ? { url: target, type: "url" as const }
            : { type: "provider" as const, provider: target.provider },
        ),
      ];
      if (targets.length === 0)
        throw new Error(`Endpoint has no configured targets: ${name}`);
      return targets;
    },
  };
}

function decodeEndpoints(
  encodedEndpoints: Record<string, string | EndpointConfig>,
): Record<string, EndpointConfig> {
  return Object.fromEntries(
    Object.entries(encodedEndpoints).map(([name, entry]) => {
      const config = typeof entry === "string" ? { default: entry } : entry;
      const decodeUrl = (value: string) => {
        let decoded: string;
        try {
          decoded = atob(value);
        } catch {
          throw new Error(`Endpoint is not valid Base64: ${name}`);
        }

        return httpsUrl.parse(decoded);
      };

      return [
        name,
        {
          default: config.default === null ? null : decodeUrl(config.default),
          ...(config.fallbacks
            ? {
                fallbacks: config.fallbacks.map((target) =>
                  typeof target === "string" ? decodeUrl(target) : target,
                ),
              }
            : {}),
        },
      ];
    }),
  );
}
