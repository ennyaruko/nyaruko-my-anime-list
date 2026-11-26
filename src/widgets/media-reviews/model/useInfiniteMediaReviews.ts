import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import {
  type MediaReviewsPage,
  mediaReviewsServiceToken,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

const REVIEWS_PER_PAGE = 10;

type UseInfiniteMediaReviewsParameters = {
  mediaId: number;
  userId: string | undefined;
};

/** Loads public media reviews page by page without persisting them to IndexedDB. */
export function useInfiniteMediaReviews({
  userId,
  mediaId,
}: UseInfiniteMediaReviewsParameters) {
  const { accessToken } = useAuth();
  const service = useAppService(mediaReviewsServiceToken);
  const queryKey = queryCacheConfig.families.mediaReviews.key(
    userId ?? "unknown",
    mediaId,
    REVIEWS_PER_PAGE,
  );

  return useInfiniteQuery<
    MediaReviewsPage,
    Error,
    InfiniteData<MediaReviewsPage>,
    typeof queryKey,
    number
  >({
    queryKey,
    initialPageParam: 1,
    enabled: Boolean(accessToken && userId && mediaId > 0),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    queryFn: ({ signal, pageParam }) => {
      if (!accessToken) {
        throw new Error("An authenticated AniList session is required.");
      }

      return service.getMediaReviews(
        accessToken,
        mediaId,
        pageParam,
        REVIEWS_PER_PAGE,
        signal,
      );
    },
  });
}
