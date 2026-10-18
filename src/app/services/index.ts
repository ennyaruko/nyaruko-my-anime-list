import {
  aniListAnimeListService,
  aniListIdentityProvider,
} from "@/app/integrations/anilist";

import { identityProviderToken } from "@/entities/auth";
import { animeListServiceToken } from "@/entities/anime-list";

import { createServiceRegistry } from "@/shared/lib/app-services";

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = createServiceRegistry()
  .register(identityProviderToken, aniListIdentityProvider)
  .register(animeListServiceToken, aniListAnimeListService)
  .build();
