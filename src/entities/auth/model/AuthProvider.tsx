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
      };
    }
  } catch {
    // Older versions stored raw tokens. Re-authenticate rather than trusting
    // a token whose expiry cannot be established.
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
          try {
            window.sessionStorage.removeItem(tokenStorageKey);
          } catch {
            // Best-effort removal of any previous token.
          }
          setStatus("anonymous");
          return;
        }

        setAccessToken(callback.accessToken);
        setExpiresAt(callback.expiresAt);
        setSessionId(createSessionId());
        setStatus("authenticated");
        try {
          const storedSession: StoredAuthSession = {
            version: 1,
            expiresAt: callback.expiresAt,
            accessToken: callback.accessToken,
          };
          window.sessionStorage.setItem(
            tokenStorageKey,
            JSON.stringify(storedSession),
          );
        } catch {
          // Current in-memory session still works without persistence.
        }
        return;
      }

      if (callback.type === "error") {
        setAuthError(callback.error);
        try {
          window.sessionStorage.removeItem(tokenStorageKey);
        } catch {
          // Best-effort removal after a rejected callback.
        }
        setStatus("anonymous");
        return;
      }

      let storedRaw: null | string = null;
      try {
        storedRaw = window.sessionStorage.getItem(tokenStorageKey);
      } catch {
        // Treat inaccessible browser storage as an anonymous session.
      }
      const storedSession = parseStoredSession(storedRaw);
      if (storedSession) {
        setAccessToken(storedSession.accessToken);
        setExpiresAt(storedSession.expiresAt);
        setSessionId(createSessionId());
        setStatus("authenticated");
      } else {
        try {
          window.sessionStorage.removeItem(tokenStorageKey);
        } catch {
          // Best-effort removal of expired or legacy token formats.
        }
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
    try {
      window.sessionStorage.removeItem(tokenStorageKey);
    } catch {
      // Logging out in memory must still work when storage is unavailable.
    }
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

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = useMemo(
    () => ({
      login,
      status,
      logout,
      authError,
      sessionId,
      accessToken,
      clearAuthError,
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
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
