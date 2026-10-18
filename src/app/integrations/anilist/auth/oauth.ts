import type { AuthorizationCallback } from "@/entities/auth";

function requiredEnv(value: string | undefined, name: string): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`AniList OAuth is not configured. Set ${name}.`);
  }
  return normalized;
}

/**
 * Starts AniList's Implicit Grant flow.
 *
 * AniList's documented implicit authorization URL uses only client_id and
 * response_type=token. The redirect URL is configured in AniList Developer
 * Settings; do not send redirect_uri in this request.
 */
export function startAniListAuthorization(): void {
  const clientId = requiredEnv(
    import.meta.env.VITE_ANILIST_CLIENT_ID,
    "VITE_ANILIST_CLIENT_ID",
  );

  const clientUrl = requiredEnv(
    import.meta.env.VITE_ANILIST_AUTHORIZATION_URL,
    "VITE_ANILIST_AUTHORIZATION_URL",
  );

  const url = new URL(clientUrl);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "token");
  window.location.assign(url.toString());
}

/** Reads OAuth response parameters and removes credentials/errors from the URL. */
export function consumeAniListAuthorizationCallback(): AuthorizationCallback {
  if (typeof window === "undefined") return { type: "none" };

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const searchParams = new URLSearchParams(window.location.search);
  const hasHashResponse =
    hashParams.has("access_token") || hashParams.has("error");
  const hasSearchError = searchParams.has("error");

  if (!hasHashResponse && !hasSearchError) return { type: "none" };

  const params = hasHashResponse ? hashParams : searchParams;
  const error = params.get("error_description") || params.get("error");
  const accessToken = params.get("access_token");

  const cleanSearch = new URLSearchParams(window.location.search);
  cleanSearch.delete("error");
  cleanSearch.delete("error_description");
  cleanSearch.delete("access_token");
  cleanSearch.delete("token_type");
  cleanSearch.delete("expires_in");
  const query = cleanSearch.toString();
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}`,
  );

  if (error) return { error, type: "error" };
  if (!accessToken) return { type: "error", error: "missing_token" };
  return { accessToken, type: "success" };
}
