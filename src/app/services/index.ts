import {
  aniListAccountProvider,
  aniListAnimeListService,
  aniListIdentityProvider,
  aniListFilterOptionsProvider,
} from "@/app/integrations/anilist";

import { identityProviderToken } from "@/entities/auth";
import { myListServiceToken } from "@/entities/my-list";
import { accountProviderToken } from "@/entities/account";
import { filterOptionsProviderToken } from "@/entities/filters";

import { createServiceRegistry } from "@/shared/lib";

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = createServiceRegistry()
  .register(identityProviderToken, aniListIdentityProvider)
  .register(accountProviderToken, aniListAccountProvider)
  .register(myListServiceToken, aniListAnimeListService)
  .register(filterOptionsProviderToken, aniListFilterOptionsProvider)
  .build();
