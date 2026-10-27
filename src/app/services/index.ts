import {
  aniListAccountProvider,
  aniListMediaListService,
  aniListIdentityProvider,
  aniListMediaSearchService,
  aniListMediaDetailService,
  aniListMediaReviewsService,
  aniListMediaRelationsService,
  aniListFilterOptionsProvider,
  aniListMediaListActionsService,
  aniListMediaRecommendationsService,
} from "@/app/integrations/anilist";

import { myListServiceToken } from "@/entities/media";
import { identityProviderToken } from "@/entities/auth";
import { accountProviderToken } from "@/entities/account";
import { mediaSearchServiceToken } from "@/entities/media";
import { mediaDetailServiceToken } from "@/entities/media";
import { mediaReviewsServiceToken } from "@/entities/media";
import { mediaRelationsServiceToken } from "@/entities/media";
import { mediaListActionsServiceToken } from "@/entities/media";
import { filterOptionsProviderToken } from "@/entities/filters";
import { mediaRecommendationsServiceToken } from "@/entities/media";

import { createServiceRegistry } from "@/shared/lib";

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = createServiceRegistry()
  .register(identityProviderToken, aniListIdentityProvider)
  .register(accountProviderToken, aniListAccountProvider)
  .register(myListServiceToken, aniListMediaListService)
  .register(mediaListActionsServiceToken, aniListMediaListActionsService)
  .register(mediaDetailServiceToken, aniListMediaDetailService)
  .register(mediaReviewsServiceToken, aniListMediaReviewsService)
  .register(mediaRelationsServiceToken, aniListMediaRelationsService)
  .register(
    mediaRecommendationsServiceToken,
    aniListMediaRecommendationsService,
  )
  .register(filterOptionsProviderToken, aniListFilterOptionsProvider)
  .register(mediaSearchServiceToken, aniListMediaSearchService)
  .build();
