import { yummyApiConfig } from "@/app/config/yummy-api";
import { remoteEndpoints } from "@/app/config/remote-endpoints";
import { createMediaPlaybackService } from "@/app/integrations/playback/service";
import { createYummyMediaInfoService } from "@/app/integrations/yummyani/media-info-service";
import { createShikimoriMediaInfoService } from "@/app/integrations/shikimori/media-info-service";
import { createMyMemoryTranslationService } from "@/app/integrations/mymemory/translation-service";
import { createYummyMediaScreenshotsService } from "@/app/integrations/yummyani/screenshots-service";
import { createGoogleTranslationService } from "@/app/integrations/google-translate/translation-service";
import { createFallbackTranslationService } from "@/app/integrations/translation/fallback-translation-service";
import { createHentaiTvAdultAnimeVideosService } from "@/app/integrations/hentai-tv/adult-anime-videos-service";
import { createAnimeApiMediaExternalIdResolver } from "@/app/integrations/anime-api/media-external-id-resolver";
import { createShikimoriMediaScreenshotsService } from "@/app/integrations/shikimori/media-screenshots-service";
import { createMuchoHentaiAdultAnimeVideosService } from "@/app/integrations/mucho-hentai/adult-anime-videos-service";
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
  aniListAccountStatisticsProvider,
  aniListMediaRecommendationsService,
} from "@/app/integrations/anilist";

import { translationServiceToken } from "@/features/translate-content";

import { myListServiceToken } from "@/entities/media";
import { identityProviderToken } from "@/entities/auth";
import { mediaSearchServiceToken } from "@/entities/media";
import { mediaDetailServiceToken } from "@/entities/media";
import { mediaReviewsServiceToken } from "@/entities/media";
import { mediaPlaybackServiceToken } from "@/entities/media";
import { mediaRelationsServiceToken } from "@/entities/media";
import { mediaListActionsServiceToken } from "@/entities/media";
import { filterOptionsProviderToken } from "@/entities/filters";
import { mediaRecommendationsServiceToken } from "@/entities/media";
import { adultAnimeVideosServiceToken } from "@/entities/adult-anime";
import { muchoHentaiAdultAnimeVideosServiceToken } from "@/entities/adult-anime";
import {
  accountProviderToken,
  accountStatisticsProviderToken,
} from "@/entities/account";
import {
  mediaExternalIdResolverToken,
  mediaScreenshotsServiceToken,
  mediaShikimoriInfoServiceToken,
} from "@/entities/media";

import { createServiceRegistry } from "@/shared/lib";

const mediaExternalIdResolver =
  createAnimeApiMediaExternalIdResolver(remoteEndpoints);
const yummyMediaInfoService = createYummyMediaInfoService(yummyApiConfig);
const yummyMediaScreenshotsService =
  createYummyMediaScreenshotsService(yummyApiConfig);

/** Composition root: concrete adapters are registered here and nowhere else. */
export const appServices = createServiceRegistry()
  .register(
    adultAnimeVideosServiceToken,
    createHentaiTvAdultAnimeVideosService(remoteEndpoints),
  )
  .register(
    muchoHentaiAdultAnimeVideosServiceToken,
    createMuchoHentaiAdultAnimeVideosService(remoteEndpoints),
  )
  .register(
    mediaPlaybackServiceToken,
    createMediaPlaybackService(remoteEndpoints, yummyApiConfig),
  )
  .register(identityProviderToken, aniListIdentityProvider)
  .register(accountProviderToken, aniListAccountProvider)
  .register(accountStatisticsProviderToken, aniListAccountStatisticsProvider)
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
    mediaShikimoriInfoServiceToken,
    createShikimoriMediaInfoService(
      remoteEndpoints,
      mediaExternalIdResolver,
      yummyMediaInfoService,
    ),
  )
  .register(
    mediaScreenshotsServiceToken,
    createShikimoriMediaScreenshotsService(
      remoteEndpoints,
      mediaExternalIdResolver,
      fetch,
      yummyMediaScreenshotsService,
    ),
  )
  .build();
