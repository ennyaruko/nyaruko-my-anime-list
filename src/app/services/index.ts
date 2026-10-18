import { aniListIdentityProvider } from "@/app/integrations/anilist";

import type { IdentityProvider } from "@/entities/auth";

/**
 * The concrete application service registry. This is the only place where
 * provider implementations are assembled into the services used at runtime.
 */
export interface AppServices {
  identityProvider: IdentityProvider;
}

export const appServices = {
  identityProvider: aniListIdentityProvider,
} satisfies AppServices;
