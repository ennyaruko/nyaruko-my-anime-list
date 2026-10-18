import { it, vi, expect, describe, afterEach } from "vitest";

import {
  startAniListAuthorization,
  consumeAniListAuthorizationCallback,
} from "../src/app/integrations/anilist/auth/oauth";

function createBrowserMock() {
  const values = new Map<string, string>();
  let assignedUrl = "";
  let replacedUrl = "";
  const browser = {
    location: {
      hash: "",
      search: "",
      pathname: "/",
      assign(url: string) {
        assignedUrl = url;
      },
    },
    history: {
      state: null,
      replaceState(_state: unknown, _title: string, url: string) {
        replacedUrl = url;
      },
    },
    sessionStorage: {
      removeItem(key: string) {
        values.delete(key);
      },
      getItem(key: string) {
        return values.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        values.set(key, value);
      },
    },
  };
  return {
    values,
    browser,
    getAssignedUrl: () => assignedUrl,
    getReplacedUrl: () => replacedUrl,
  };
}

function tokenWithExpiry(expiresAt: number): string {
  const payload = btoa(JSON.stringify({ exp: Math.floor(expiresAt / 1_000) }))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `header.${payload}.signature`;
}

function configureAuthorizationEnvironment() {
  vi.stubEnv("VITE_ANILIST_CLIENT_ID", "test-client");
  vi.stubEnv(
    "VITE_ANILIST_AUTHORIZATION_URL",
    "https://anilist.co/api/v2/oauth/authorize",
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("AniList OAuth callback", () => {
  it("sends state and accepts a matching, unexpired callback", () => {
    configureAuthorizationEnvironment();
    const mock = createBrowserMock();
    vi.stubGlobal("window", mock.browser);

    startAniListAuthorization();
    const authorizationUrl = new URL(mock.getAssignedUrl());
    const state = authorizationUrl.searchParams.get("state");
    expect(state).toBeTruthy();
    expect(authorizationUrl.searchParams.get("response_type")).toBe("token");

    const token = tokenWithExpiry(Date.now() + 60 * 60 * 1_000);
    const callbackParams = new URLSearchParams({
      state: state ?? "",
      access_token: token,
      token_type: "Bearer",
    });
    mock.browser.location.hash = `#${callbackParams.toString()}`;

    const result = consumeAniListAuthorizationCallback();
    expect(result.type).toBe("success");
    if (result.type === "success") {
      expect(result.accessToken).toBe(token);
      expect(result.expiresAt).toBeGreaterThan(Date.now());
    }
    expect(mock.getReplacedUrl()).toBe("/");
    expect(mock.values.size).toBe(0);
  });

  it("rejects mismatched state and removes callback data from the URL", () => {
    configureAuthorizationEnvironment();
    const mock = createBrowserMock();
    vi.stubGlobal("window", mock.browser);

    startAniListAuthorization();
    const callbackParams = new URLSearchParams({
      state: "attacker-state",
      access_token: tokenWithExpiry(Date.now() + 60_000),
    });
    mock.browser.location.hash = `#${callbackParams.toString()}`;

    expect(consumeAniListAuthorizationCallback()).toEqual({
      type: "error",
      error: "invalid_oauth_state",
    });
    expect(mock.getReplacedUrl()).toBe("/");
    expect(mock.values.size).toBe(0);
  });

  it("rejects expired tokens even when the state matches", () => {
    configureAuthorizationEnvironment();
    const mock = createBrowserMock();
    vi.stubGlobal("window", mock.browser);

    startAniListAuthorization();
    const state = new URL(mock.getAssignedUrl()).searchParams.get("state");
    const callbackParams = new URLSearchParams({
      state: state ?? "",
      access_token: tokenWithExpiry(Date.now() - 10_000),
    });
    mock.browser.location.hash = `#${callbackParams.toString()}`;

    expect(consumeAniListAuthorizationCallback()).toEqual({
      type: "error",
      error: "missing_or_expired_token_expiry",
    });
  });
});
