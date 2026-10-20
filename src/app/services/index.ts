import {
  aniListAnimeListService,
  aniListIdentityProvider,
} from "@/app/integrations/anilist";

import { identityProviderToken } from "@/entities/auth";
import { myListServiceToken } from "@/entities/my-list";

import { createServiceRegistry } from "@/shared/lib/app-services";

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = createServiceRegistry()
  .register(identityProviderToken, aniListIdentityProvider)
  .register(myListServiceToken, aniListAnimeListService)
  .build();
