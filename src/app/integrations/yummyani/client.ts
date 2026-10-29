import type { RemoteConfigResolver } from "@/shared/lib/remote-endpoints";

export class YummyApiError extends Error {
  constructor(public readonly status: number) {
    super(`Yummyani request failed: ${status}`);
  }
}

function wait(ms: number, signal: AbortSignal) {
  signal.throwIfAborted();
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, { once: true });
  });
}

export function createYummyClient(
  config: RemoteConfigResolver,
  fetcher: typeof fetch = fetch,
) {
  let nextRequestAt = 0;
  return async function request(
    path: string,
    params: Record<string, string>,
    signal: AbortSignal,
  ): Promise<unknown> {
    signal.throwIfAborted();
    const [base, token] = await Promise.all([
      config.resolve("yummyApi"),
      config.resolveValue("yummyApplication"),
    ]);
    const url = new URL(path, `${base.replace(/\/$/, "")}/`);
    for (const [key, value] of Object.entries(params))
      url.searchParams.set(key, value);
    for (let attempt = 0; attempt < 2; attempt++) {
      const delay = Math.max(0, nextRequestAt - Date.now());
      nextRequestAt = Date.now() + delay + 350;
      if (delay) await wait(delay, signal);
      signal.throwIfAborted();
      const response = await fetcher(url, {
        credentials: "omit",
        signal: AbortSignal.any([signal, AbortSignal.timeout(12_000)]),
        headers: {
          Lang: "ru",
          "X-Application": token,
          Accept: "application/json",
        },
      });
      if (response.status === 429 && attempt === 0) {
        const retryAfter = Number(response.headers.get("Retry-After"));
        await wait(
          Math.max(5_000, Math.min(10_000, retryAfter * 1000 || 5_000)),
          signal,
        );
        continue;
      }
      if (!response.ok) throw new YummyApiError(response.status);
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || !("response" in payload))
        throw new Error("Invalid Yummyani response");
      return payload.response;
    }
    throw new YummyApiError(429);
  };
}
