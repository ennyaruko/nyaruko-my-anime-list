import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { queryCacheConfig } from "@/shared/lib";

type UseMediaDetailRefreshParameters = {
  mediaId: number;
  isAdultMode: boolean;
  userId: string | undefined;
  malId: null | number | undefined;
};

/** Invalidates every query that supplies content to the media detail page. */
export function useMediaDetailRefresh({
  malId,
  userId,
  mediaId,
  isAdultMode,
}: UseMediaDetailRefreshParameters) {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryCacheConfig.families.mediaDetail.key(
          userId ?? "unknown",
          mediaId,
        ),
      }),
      queryClient.invalidateQueries({
        queryKey: queryCacheConfig.families.mediaScreenshots.key(
          mediaId,
          malId ?? null,
        ),
      }),
      queryClient.invalidateQueries({
        queryKey: queryCacheConfig.families.mediaReviews.key(
          userId ?? "unknown",
          mediaId,
        ),
      }),
      queryClient.invalidateQueries({
        queryKey: queryCacheConfig.families.mediaRelations.key(
          userId ?? "unknown",
          mediaId,
          isAdultMode,
        ),
      }),
      queryClient.invalidateQueries({
        queryKey: queryCacheConfig.families.mediaRecommendations.key(
          userId ?? "unknown",
          mediaId,
          5,
          isAdultMode,
        ),
      }),
    ]);
  }, [isAdultMode, malId, mediaId, queryClient, userId]);
}
