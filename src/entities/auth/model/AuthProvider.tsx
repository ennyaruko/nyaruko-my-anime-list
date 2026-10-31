import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { useAppService } from "@/shared/lib/app-services";

import { identityProviderToken } from "./identity-provider";
import { AuthContext, type AuthStatus } from "./auth-context";

const TOKEN_STORAGE_PREFIX = "my-anime-list";
const EXPIRY_SAFETY_WINDOW_MS = 60_000;
const MAX_TIMER_DELAY_MS = 2_147_000_000;

type StoredAuthSession = {
  version: 1;
  expiresAt: number;
  sessionId: string;
  accessToken: string;
};

function getTokenStorageKey(providerId: string): string {
  return `${TOKEN_STORAGE_PREFIX}.${providerId}.access-token`;
}

function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function createSessionId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function parseStoredSession(raw: null | string): null | StoredAuthSession {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredAuthSession>;
    if (
      value.version === 1 &&
      typeof value.accessToken === "string" &&
      value.accessToken.length > 0 &&
      typeof value.expiresAt === "number" &&
      Number.isFinite(value.expiresAt) &&
      value.expiresAt > Date.now() + EXPIRY_SAFETY_WINDOW_MS
    ) {
      return {
        version: 1,
        expiresAt: value.expiresAt,
        accessToken: value.accessToken,
        sessionId:
          typeof value.sessionId === "string" && value.sessionId.length > 0
            ? value.sessionId
            : createSessionId(),
      };
    }
  } catch {
    // Older versions stored raw tokens. Re-authenticate rather than trusting
    // a token whose expiry cannot be established.
  }
  return null;
}

function storeAuthSession(key: string, session: StoredAuthSession): void {
  const value = JSON.stringify(session);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Do not leave an older persistent session (possibly with legacy user data)
    // behind when falling back to tab-scoped storage.
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Persistent storage may be completely unavailable.
    }
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // The in-memory session still works until this page is closed.
    }
    return;
  }

  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // The persistent session has already been stored successfully.
  }
}

function removeStoredAuthSession(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Best-effort cleanup when browser storage is unavailable.
  }
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Remove any session-scoped copy left by an older app version.
  }
}

function readStoredAuthSession(key: string): null | StoredAuthSession {
  let raw: null | string = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // Fall back to an existing tab-scoped session if persistent storage is blocked.
  }

  const persistentSession = parseStoredSession(raw);
  if (persistentSession) {
    let needsNormalization = false;
    if (raw !== null) {
      try {
        const value = JSON.parse(raw) as Record<string, unknown>;
        needsNormalization =
          Object.prototype.hasOwnProperty.call(value, "accountId") ||
          typeof value.sessionId !== "string" ||
          value.sessionId.length === 0;
      } catch {
        // parseStoredSession already validated this value.
      }
    }

    if (needsNormalization) {
      // Rewrite legacy sessions so accountId no longer lives in localStorage
      // and a generated sessionId stays stable across future app launches.
      storeAuthSession(key, persistentSession);
    } else {
      try {
        window.sessionStorage.removeItem(key);
      } catch {
        // The persistent session remains valid.
      }
    }
    return persistentSession;
  }
  if (raw !== null) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Continue to the legacy session-scoped copy.
    }
  }

  try {
    raw = window.sessionStorage.getItem(key);
  } catch {
    raw = null;
  }
  const legacySession = parseStoredSession(raw);
  if (legacySession) {
    storeAuthSession(key, legacySession);
    return legacySession;
  }

  if (raw !== null) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Invalid or expired session data must not be restored.
    }
  }
  return null;
}

type AuthProviderProps = {
  children: ReactNode;
  /** App-level cleanup hook; auth state itself remains provider-neutral. */
  onLogout?: (
    providerId: string,
    sessionId: null | string,
  ) => void | Promise<void>;
};

/**
 * Provider-neutral auth state; app/ supplies integration and logout
 * orchestration.
 */
export function AuthProvider({ children, onLogout }: AuthProviderProps) {
  const identityProvider = useAppService(identityProviderToken);
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [expiresAt, setExpiresAt] = useState<null | number>(null);
  const [sessionId, setSessionId] = useState<null | string>(null);
  const [authError, setAuthError] = useState<null | string>(null);
  const initializedProviderId = useRef<null | string>(null);

  const tokenStorageKey = getTokenStorageKey(identityProvider.id);

  useEffect(() => {
    // React Strict Mode replays effects in development. Consume one-shot OAuth
    // callbacks only once per provider.
    if (initializedProviderId.current === identityProvider.id) return;
    initializedProviderId.current = identityProvider.id;

    setStatus("initializing");
    setAccessToken(null);
    setExpiresAt(null);
    setSessionId(null);
    setAuthError(null);

    try {
      const callback = identityProvider.consumeAuthorizationCallback();
      if (callback.type === "success") {
        if (callback.expiresAt <= Date.now() + EXPIRY_SAFETY_WINDOW_MS) {
          setAuthError("missing_or_expired_token_expiry");
          removeStoredAuthSession(tokenStorageKey);
          setStatus("anonymous");
          return;
        }

        setAccessToken(callback.accessToken);
        setExpiresAt(callback.expiresAt);
        const newSessionId = createSessionId();
        setSessionId(newSessionId);
        setStatus("authenticated");
        try {
          const storedSession: StoredAuthSession = {
            version: 1,
            sessionId: newSessionId,
            expiresAt: callback.expiresAt,
            accessToken: callback.accessToken,
          };
          storeAuthSession(tokenStorageKey, storedSession);
        } catch {
          // Current in-memory session still works without persistence.
        }
        return;
      }

      if (callback.type === "error") {
        setAuthError(callback.error);
        removeStoredAuthSession(tokenStorageKey);
        setStatus("anonymous");
        return;
      }

      const storedSession = readStoredAuthSession(tokenStorageKey);
      if (storedSession) {
        setAccessToken(storedSession.accessToken);
        setExpiresAt(storedSession.expiresAt);
        setSessionId(storedSession.sessionId);
        setStatus("authenticated");
      } else {
        removeStoredAuthSession(tokenStorageKey);
        setStatus("anonymous");
      }
    } catch (error) {
      setAuthError(toErrorMessage(error, "authorization_initialization_error"));
      setStatus("anonymous");
    }
  }, [identityProvider, tokenStorageKey]);

  const login = useCallback(() => {
    setAuthError(null);
    try {
      identityProvider.beginAuthorization();
    } catch (error) {
      setAuthError(toErrorMessage(error, "authorization_configuration_error"));
    }
  }, [identityProvider]);

  const logout = useCallback(async () => {
    removeStoredAuthSession(tokenStorageKey);
    const endingSessionId = sessionId;
    setAccessToken(null);
    setExpiresAt(null);
    setSessionId(null);
    setStatus("anonymous");
    setAuthError(null);
    try {
      await onLogout?.(identityProvider.id, endingSessionId);
    } catch {
      // Logout must complete even if best-effort cache cleanup fails.
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("my-anime-list:auth-cleanup-error"),
        );
      }
    }
  }, [identityProvider.id, onLogout, sessionId, tokenStorageKey]);

  useEffect(() => {
    if (status !== "authenticated" || !expiresAt || !sessionId) return;

    let timer: undefined | ReturnType<typeof setTimeout>;
    const checkExpiry = () => {
      const remaining = expiresAt - Date.now() - EXPIRY_SAFETY_WINDOW_MS;
      if (remaining <= 0) {
        void logout();
        return;
      }
      timer = setTimeout(checkExpiry, Math.min(remaining, MAX_TIMER_DELAY_MS));
    };

    checkExpiry();
    return () => {
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [expiresAt, logout, sessionId, status]);

  const value = useMemo(
    () => ({
      login,
      status,
      logout,
      authError,
      sessionId,
      accessToken,
      identityProvider,
    }),
    [
      identityProvider,
      status,
      accessToken,
      sessionId,
      authError,
      login,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
