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

function getTokenStorageKey(providerId: string): string {
  return `${TOKEN_STORAGE_PREFIX}.${providerId}.access-token`;
}

function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

type AuthProviderProps = {
  children: ReactNode;
  /** App-level cleanup hook; auth state itself remains provider-neutral. */
  onLogout?: (providerId: string) => void | Promise<void>;
};

/** Provider-neutral auth state; app/ supplies integration and logout orchestration. */
export function AuthProvider({ children, onLogout }: AuthProviderProps) {
  const identityProvider = useAppService(identityProviderToken);
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [authError, setAuthError] = useState<null | string>(null);
  const initializedProviderId = useRef<null | string>(null);

  const tokenStorageKey = getTokenStorageKey(identityProvider.id);

  useEffect(() => {
    // React Strict Mode replays effects in development. OAuth callbacks are
    // one-shot inputs, so process them once per provider rather than consuming
    // the callback twice (which is especially important when storage is blocked).
    if (initializedProviderId.current === identityProvider.id) return;
    initializedProviderId.current = identityProvider.id;

    setStatus("initializing");
    setAccessToken(null);
    setAuthError(null);

    try {
      const callback = identityProvider.consumeAuthorizationCallback();
      if (callback.type === "success") {
        setAccessToken(callback.accessToken);
        setStatus("authenticated");
        try {
          window.sessionStorage.setItem(tokenStorageKey, callback.accessToken);
        } catch {
          // Current in-memory session still works when storage is unavailable.
        }
        return;
      }

      if (callback.type === "error") setAuthError(callback.error);
      let storedToken: null | string = null;
      try {
        storedToken = window.sessionStorage.getItem(tokenStorageKey);
      } catch {
        // Treat inaccessible browser storage as an anonymous session.
      }
      if (storedToken) {
        setAccessToken(storedToken);
        setStatus("authenticated");
      } else {
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
    setAccessToken(null);
    setStatus("anonymous");
    setAuthError(null);
    await onLogout?.(identityProvider.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLogout, tokenStorageKey]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = useMemo(
    () => ({
      login,
      status,
      logout,
      authError,
      accessToken,
      clearAuthError,
      identityProvider,
    }),
    [
      identityProvider,
      status,
      accessToken,
      authError,
      login,
      logout,
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
