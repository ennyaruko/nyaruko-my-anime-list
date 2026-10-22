import { createContext } from "react";

import type { IdentityProvider } from "./identity-provider";

export type AuthStatus = "anonymous" | "initializing" | "authenticated";

/** Provider-neutral authentication state consumed by application UI. */
export type AuthContextValue = {
  login: () => void;
  status: AuthStatus;
  authError: null | string;
  /** Non-secret identifier for the active auth session; never the access token. */
  sessionId: null | string;
  accessToken: null | string;
  logout: () => Promise<void>;
  identityProvider: IdentityProvider;
};

export const AuthContext = createContext<null | AuthContextValue>(null);
