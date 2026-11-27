import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { mediaReviewsServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseFullMediaReviewsParameters = {
  mediaId: number;
  enabled: boolean;
  userId: string | undefined;
};

/** Loads every public review on demand; this query stays in memory only. */
export function useFullMediaReviews({
  userId,
  enabled,
  mediaId,
}: UseFullMediaReviewsParameters) {
  const { accessToken } = useAuth();
  const service = useAppService(mediaReviewsServiceToken);
  const queryKey = [
    ...queryCacheConfig.families.mediaReviews.key(
      userId ?? "unknown",
      mediaId,
      50,
    ),
    "all",
  ] as const;

  return useQuery({
    queryKey,
    enabled: enabled && Boolean(accessToken && userId && mediaId > 0),
    queryFn: async ({ signal }) => {
      if (!accessToken) {
        throw new Error("An authenticated AniList session is required.");
      }

      const reviews = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await service.getMediaReviews(
          accessToken,
          mediaId,
          page,
          50,
          signal,
        );
        reviews.push(...response.items);
        hasNextPage = response.hasNextPage;
        page += 1;
      }

      return reviews;
    },
  });
}
