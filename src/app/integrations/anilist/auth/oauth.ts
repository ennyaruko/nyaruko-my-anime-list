import type { AuthorizationCallback } from "@/entities/auth";

const OAUTH_STATE_STORAGE_KEY = "my-anime-list.anilist.oauth-state";
const OAUTH_STATE_BYTES = 32;

function requiredEnv(value: string | undefined, name: string): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`AniList OAuth is not configured. Set ${name}.`);
  }
  return normalized;
}

function createOAuthState(): string {
  if (typeof crypto === "undefined" || !crypto.getRandomValues) {
    throw new Error("secure_random_unavailable");
  }

  const bytes = crypto.getRandomValues(new Uint8Array(OAUTH_STATE_BYTES));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * AniList's implicit grant returns the token in the redirect fragment.
 * State binds the callback to the initiating browser session.
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
  const state = createOAuthState();

  // Fail closed: a callback cannot be validated if session storage is blocked.
  try {
    window.sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);
  } catch {
    throw new Error("oauth_state_storage_unavailable");
  }

  const url = new URL(clientUrl);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "token");
  url.searchParams.set("state", state);
  window.location.assign(url.toString());
}

function readJwtExpiry(accessToken: string): null | number {
  const parts = accessToken.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as {
      exp?: unknown;
    };
    return typeof payload.exp === "number" && Number.isFinite(payload.exp)
      ? payload.exp * 1_000
      : null;
  } catch {
    return null;
  }
}

function resolveExpiry(
  accessToken: string,
  expiresInValue: null | string,
): null | number {
  // AniList documents its access tokens as JWTs; prefer their exp claim.
  const jwtExpiry = readJwtExpiry(accessToken);
  if (jwtExpiry !== null) return jwtExpiry;

  if (expiresInValue === null) return null;
  const expiresIn = Number(expiresInValue);
  if (!Number.isFinite(expiresIn) || expiresIn <= 0) return null;
  return Date.now() + expiresIn * 1_000;
}

function cleanAuthorizationResponseUrl(): void {
  const cleanSearch = new URLSearchParams(window.location.search);
  for (const key of [
    "error",
    "error_description",
    "access_token",
    "token_type",
    "expires_in",
    "state",
    "scope",
  ]) {
    cleanSearch.delete(key);
  }

  const query = cleanSearch.toString();
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}`,
  );
}

/** Validate state before accepting either success or error responses. */
export function consumeAniListAuthorizationCallback(): AuthorizationCallback {
  if (typeof window === "undefined") return { type: "none" };

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const searchParams = new URLSearchParams(window.location.search);
  const hasHashResponse =
    hashParams.has("access_token") ||
    hashParams.has("error") ||
    hashParams.has("state");
  const hasSearchResponse =
    searchParams.has("access_token") ||
    searchParams.has("error") ||
    searchParams.has("state");

  if (!hasHashResponse && !hasSearchResponse) return { type: "none" };

  const params = hasHashResponse ? hashParams : searchParams;
  const error = params.get("error_description") || params.get("error");
  const accessToken = params.get("access_token");
  const returnedState = params.get("state");

  let expectedState: null | string = null;
  try {
    expectedState = window.sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);
    window.sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);
  } catch {
    cleanAuthorizationResponseUrl();
    return { type: "error", error: "oauth_state_storage_unavailable" };
  }

  // Remove token/error data from the address bar before returning any outcome.
  cleanAuthorizationResponseUrl();

  if (!expectedState || !returnedState || returnedState !== expectedState) {
    return { type: "error", error: "invalid_oauth_state" };
  }
  if (error) return { error, type: "error" };
  if (!accessToken) return { type: "error", error: "missing_token" };

  const expiresAt = resolveExpiry(accessToken, params.get("expires_in"));
  if (expiresAt === null || expiresAt <= Date.now()) {
    return { type: "error", error: "missing_or_expired_token_expiry" };
  }

  return { expiresAt, accessToken, type: "success" };
}
