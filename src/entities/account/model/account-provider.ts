import { createServiceToken } from "@/shared/lib";

import type { AccountProfile } from "./account";

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
