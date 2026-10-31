import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { mediaReviewsServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseMediaReviewsParameters = {
  mediaId: number;
  userId: string | undefined;
};

/** Loads the separate, non-persisted reviews query for the media page. */
export function useMediaReviews({
  userId,
  mediaId,
}: UseMediaReviewsParameters) {
  const { accessToken } = useAuth();
  const service = useAppService(mediaReviewsServiceToken);
  const queryKey = queryCacheConfig.families.mediaReviews.key(
    userId ?? "unknown",
    mediaId,
  );

  return useQuery({
    queryKey,
    enabled: Boolean(accessToken && userId && mediaId > 0),
    queryFn: ({ signal }) => {
      if (!accessToken) {
        throw new Error("An authenticated AniList session is required.");
      }

      return service.getMediaReviews(accessToken, mediaId, signal);
    },
  });
}
