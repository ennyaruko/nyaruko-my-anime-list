import { createServiceToken } from "@/shared/lib/app-services";

/** Provider-neutral account shape exposed to application code. */
export type AccountProfile = {
  id: string;
  username: string;
  avatarUrl?: null | string;
  profileUrl?: null | string;
};

export type AuthorizationCallback =
  | { type: "none" }
  | { type: "error"; error: string }
  | { type: "success"; accessToken: string };

/**
 * Port for an identity provider. Provider DTOs and SDK types must not cross
 * this boundary; implementations map them to AccountProfile.
 */
export interface IdentityProvider {
  readonly id: string;
  beginAuthorization(): void;
  readonly displayName: string;
  consumeAuthorizationCallback(): AuthorizationCallback;
  getCurrentAccount(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<AccountProfile>;
}

/** Shared typed DI token; the concrete implementation is registered by app/. */
export const identityProviderToken =
  createServiceToken<IdentityProvider>("identityProvider");
