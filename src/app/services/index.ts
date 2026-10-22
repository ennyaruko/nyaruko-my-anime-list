import {
  aniListAccountProvider,
  aniListAnimeListService,
  aniListIdentityProvider,
} from "@/app/integrations/anilist";

import { identityProviderToken } from "@/entities/auth";
import { myListServiceToken } from "@/entities/my-list";
import { accountProviderToken } from "@/entities/account";

import { createServiceRegistry } from "@/shared/lib";

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = createServiceRegistry()
  .register(identityProviderToken, aniListIdentityProvider)
  .register(accountProviderToken, aniListAccountProvider)
  .register(myListServiceToken, aniListAnimeListService)
  .build();
