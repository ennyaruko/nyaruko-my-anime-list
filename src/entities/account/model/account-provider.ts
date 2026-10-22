import { createServiceToken } from "@/shared/lib";

/** Provider-neutral public profile returned by the current-account query. */
export type AccountProfile = {
  id: string;
  username: string;
  avatarUrl?: null | string;
  profileUrl?: null | string;
};

/** Data port for retrieving the profile associated with an active OAuth token. */
export interface AccountProvider {
  getCurrentAccount(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<AccountProfile>;
}

/** Concrete account provider is registered by the application composition root. */
export const accountProviderToken =
  createServiceToken<AccountProvider>("accountProvider");
