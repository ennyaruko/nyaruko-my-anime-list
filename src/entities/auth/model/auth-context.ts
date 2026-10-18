import { createContext } from "react";

import type { IdentityProvider } from "./identity-provider";

export type AuthStatus = "anonymous" | "initializing" | "authenticated";

/** Provider-neutral authentication state consumed by application UI. */
export type AuthContextValue = {
  login: () => void;
  status: AuthStatus;
  authError: null | string;
  /** Ephemeral identifier for this login session; never contains the access token. */
  sessionId: null | string;
  accessToken: null | string;
  clearAuthError: () => void;
  logout: () => Promise<void>;
  identityProvider: IdentityProvider;
};

export const AuthContext = createContext<null | AuthContextValue>(null);
