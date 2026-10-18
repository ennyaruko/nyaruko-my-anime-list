import { aniListIdentityProvider } from "@/app/integrations/anilist";

import { identityProviderToken } from "@/entities/auth";

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = new Map([
  [identityProviderToken.key, aniListIdentityProvider],
]);
