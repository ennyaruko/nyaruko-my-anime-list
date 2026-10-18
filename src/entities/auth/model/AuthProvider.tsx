import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { useAppServices } from "@/shared/lib";

import type { IdentityProvider } from "./identity-provider";
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
};

/**
 * Provider-neutral auth state. The concrete identity provider is read from the
 * app service registry through a lower-layer API; this module never imports app/.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { identityProvider } = useAppServices<{
    identityProvider: IdentityProvider;
  }>();
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [authError, setAuthError] = useState<null | string>(null);

  const tokenStorageKey = getTokenStorageKey(identityProvider.id);

  useEffect(() => {
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
          // The current session can still work when storage is unavailable.
        }
        return;
      }

      if (callback.type === "error") setAuthError(callback.error);

      const storedToken = window.sessionStorage.getItem(tokenStorageKey);
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

  const logout = useCallback(() => {
    try {
      window.sessionStorage.removeItem(tokenStorageKey);
    } catch {
      // Logging out in memory must still work when storage is unavailable.
    }
    setAccessToken(null);
    setStatus("anonymous");
    setAuthError(null);
  }, [tokenStorageKey]);

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
