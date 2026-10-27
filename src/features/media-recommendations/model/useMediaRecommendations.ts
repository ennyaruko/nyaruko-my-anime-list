import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { MediaRecommendationsPage } from "@/entities/media";
import { mediaRecommendationsServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseMediaRecommendationsParameters = {
  mediaId: number;
  perPage?: number;
  userId: string | undefined;
};

/** Loads paginated similar media without persisting provider results. */
export function useMediaRecommendations({
  userId,
  mediaId,
  perPage = 5,
}: UseMediaRecommendationsParameters) {
  const { accessToken } = useAuth();
  const service = useAppService(mediaRecommendationsServiceToken);
  const queryKey = queryCacheConfig.families.mediaRecommendations.key(
    userId ?? "unknown",
    mediaId,
    perPage,
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
    queryFn: ({ signal, pageParam }) => {
      if (!accessToken) {
        throw new Error("An authenticated AniList session is required.");
      }

      return service.getMediaRecommendations(
        accessToken,
        mediaId,
        pageParam,
        signal,
        perPage,
      );
    },
  });
}
