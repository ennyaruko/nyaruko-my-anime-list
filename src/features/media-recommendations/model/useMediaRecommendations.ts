import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { filterMediaForContentMode } from "@/entities/media";
import { mediaRecommendationsServiceToken } from "@/entities/media";
import type {
  MediaContentMode,
  MediaRecommendationSort,
  MediaRecommendationsPage,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseMediaRecommendationsParameters = {
  mediaId: number;
  perPage?: number;
  excludeListed?: boolean;
  userId: string | undefined;
  contentMode: MediaContentMode;
  sort?: MediaRecommendationSort;
};

/** Loads paginated similar media without persisting provider results. */
export function useMediaRecommendations({
  userId,
  mediaId,
  perPage = 5,
  contentMode,
  sort = "ratingDesc",
  excludeListed = false,
}: UseMediaRecommendationsParameters) {
  const { accessToken } = useAuth();
  const service = useAppService(mediaRecommendationsServiceToken);
  const queryKey = queryCacheConfig.families.mediaRecommendations.key(
    userId ?? "unknown",
    mediaId,
    perPage,
    sort,
    excludeListed,
    contentMode,
  );

  return useInfiniteQuery<
    MediaRecommendationsPage,
    Error,
    InfiniteData<MediaRecommendationsPage>,
    typeof queryKey,
    number
  >({
    queryKey,
    initialPageParam: 1,
    enabled: Boolean(accessToken && userId && mediaId > 0),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    queryFn: async ({ signal, pageParam }) => {
      if (!accessToken) {
        throw new Error("An authenticated AniList session is required.");
      }

      const page = await service.getMediaRecommendations(
        accessToken,
        mediaId,
        pageParam,
        sort,
        signal,
        perPage,
      );
      return {
        ...page,
        items: filterMediaForContentMode(page.items, contentMode).filter(
          (media) => !excludeListed || media.listEntryId === null,
        ),
      };
    },
  });
}
