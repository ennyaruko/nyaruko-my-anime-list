import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import type { MediaContentMode } from "@/entities/media";

import { queryCacheConfig } from "@/shared/lib";

type UseMediaDetailRefreshParameters = {
  mediaId: number;
  userId: string | undefined;
  contentMode: MediaContentMode;
  malId: null | number | undefined;
};

/** Invalidates every query that supplies content to the media detail page. */
export function useMediaDetailRefresh({
  malId,
  userId,
  mediaId,
  contentMode,
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
          contentMode,
        ),
      }),
      queryClient.invalidateQueries({
        queryKey: queryCacheConfig.families.mediaRecommendations.key(
          userId ?? "unknown",
          mediaId,
          5,
          contentMode,
        ),
      }),
    ]);
  }, [contentMode, malId, mediaId, queryClient, userId]);
}
