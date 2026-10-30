import { remoteEndpoints } from "@/app/config/remote-endpoints";
import { createMediaPlaybackService } from "@/app/integrations/playback/service";
import { createMyMemoryTranslationService } from "@/app/integrations/mymemory/translation-service";
import { createYummyMediaScreenshotsService } from "@/app/integrations/yummyani/screenshots-service";
import { createGoogleTranslationService } from "@/app/integrations/google-translate/translation-service";
import { createFallbackMediaScreenshotsService } from "@/app/integrations/fallback-media-screenshots-service";
import { createFallbackTranslationService } from "@/app/integrations/translation/fallback-translation-service";
import { createAnimeApiMediaExternalIdResolver } from "@/app/integrations/anime-api/media-external-id-resolver";
import { createShikimoriMediaScreenshotsService } from "@/app/integrations/shikimori/media-screenshots-service";
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

import { translationServiceToken } from "@/features/translate-content";

import { myListServiceToken } from "@/entities/media";
import { identityProviderToken } from "@/entities/auth";
import { accountProviderToken } from "@/entities/account";
import { mediaSearchServiceToken } from "@/entities/media";
import { mediaDetailServiceToken } from "@/entities/media";
import { mediaReviewsServiceToken } from "@/entities/media";
import { mediaPlaybackServiceToken } from "@/entities/media";
import { mediaRelationsServiceToken } from "@/entities/media";
import { mediaListActionsServiceToken } from "@/entities/media";
import { filterOptionsProviderToken } from "@/entities/filters";
import { mediaRecommendationsServiceToken } from "@/entities/media";
import {
  mediaExternalIdResolverToken,
  mediaScreenshotsServiceToken,
} from "@/entities/media";

import { createServiceRegistry } from "@/shared/lib";

const mediaExternalIdResolver =
  createAnimeApiMediaExternalIdResolver(remoteEndpoints);

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = createServiceRegistry()
  .register(
    mediaPlaybackServiceToken,
    createMediaPlaybackService(remoteEndpoints),
  )
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
  .register(
    translationServiceToken,
    createFallbackTranslationService([
      createGoogleTranslationService(remoteEndpoints),
      createMyMemoryTranslationService(remoteEndpoints),
    ]),
  )
  .register(mediaExternalIdResolverToken, mediaExternalIdResolver)
  .register(
    mediaScreenshotsServiceToken,
    createFallbackMediaScreenshotsService(
      createShikimoriMediaScreenshotsService(
        remoteEndpoints,
        mediaExternalIdResolver,
      ),
      createYummyMediaScreenshotsService(remoteEndpoints),
    ),
  )
  .build();
