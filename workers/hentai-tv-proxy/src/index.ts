const allowedOrigins = new Set([
  "https://nyar1othotep.github.io",
  "http://localhost:5173",
]);

function createCorsHeaders(origin: null | string): Headers {
  const headers = new Headers({ Vary: "Origin" });

  if (origin && allowedOrigins.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Accept");
    headers.set("Access-Control-Max-Age", "86400");
  }

  return headers;
}

function jsonResponse(
  body: unknown,
  status: number,
  corsHeaders: Headers,
): Response {
  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");

  return new Response(JSON.stringify(body), { status, headers });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const requestUrl = new URL(request.url);
    const origin = request.headers.get("Origin");
    const corsHeaders = createCorsHeaders(origin);

    if (origin && !allowedOrigins.has(origin)) {
      return jsonResponse({ error: "Origin is not allowed" }, 403, corsHeaders);
    }

    if (request.method === "OPTIONS") {
      if (!origin) {
        return new Response(null, { status: 204 });
      }

      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
    }

    if (requestUrl.pathname !== "/api/search") {
      return jsonResponse({ error: "Not found" }, 404, corsHeaders);
    }

    const title = requestUrl.searchParams.get("q")?.trim();
    if (!title || title.length > 300) {
      return jsonResponse({ error: "Invalid search query" }, 400, corsHeaders);
    }

    const upstreamUrl = new URL("https://hentai.tv/api/search");
    upstreamUrl.searchParams.set("q", title);

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        signal: request.signal,
        headers: { Accept: "application/json" },
      });

      if (!upstreamResponse.ok) {
        return jsonResponse(
          { error: "Upstream search failed" },
          502,
          corsHeaders,
        );
      }

      const headers = new Headers(corsHeaders);
      headers.set("Content-Type", "application/json; charset=utf-8");
      headers.set("Cache-Control", "public, max-age=300");

      return new Response(upstreamResponse.body, {
        headers,
        status: upstreamResponse.status,
      });
    } catch {
      return jsonResponse(
        { error: "Upstream search is unavailable" },
        502,
        corsHeaders,
      );
    }
  },
};
