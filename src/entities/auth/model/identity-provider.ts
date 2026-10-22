import { createServiceToken } from "@/shared/lib";

export type AuthorizationCallback =
  | { type: "none" }
  | { type: "error"; error: string }
  | { type: "success"; expiresAt: number; accessToken: string };

/**
 * OAuth/session establishment port. Profile fetching is a separate query
 * concern and is provided through AccountProvider.
 */
export interface IdentityProvider {
  readonly id: string;
  beginAuthorization(): void;
  readonly displayName: string;
  consumeAuthorizationCallback(): AuthorizationCallback;
}

/** Shared typed DI token; the concrete implementation is registered by app/. */
export const identityProviderToken =
  createServiceToken<IdentityProvider>("identityProvider");
