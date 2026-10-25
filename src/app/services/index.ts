import {
  aniListAccountProvider,
  aniListMediaListService,
  aniListIdentityProvider,
  aniListMediaSearchService,
  aniListFilterOptionsProvider,
} from "@/app/integrations/anilist";

import { myListServiceToken } from "@/entities/media";
import { identityProviderToken } from "@/entities/auth";
import { accountProviderToken } from "@/entities/account";
import { mediaSearchServiceToken } from "@/entities/media";
import { filterOptionsProviderToken } from "@/entities/filters";

import { createServiceRegistry } from "@/shared/lib";

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = createServiceRegistry()
  .register(identityProviderToken, aniListIdentityProvider)
  .register(accountProviderToken, aniListAccountProvider)
  .register(myListServiceToken, aniListMediaListService)
  .register(filterOptionsProviderToken, aniListFilterOptionsProvider)
  .register(mediaSearchServiceToken, aniListMediaSearchService)
  .build();
