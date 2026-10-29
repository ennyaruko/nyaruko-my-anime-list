import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { mediaRelationsServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseMediaRelationsParameters = {
  mediaId: number;
  userId: string | undefined;
};

/** Loads the separate, non-persisted relations query for the media page. */
export function useMediaRelations({
  userId,
  mediaId,
}: UseMediaRelationsParameters) {
  const { accessToken } = useAuth();
  const service = useAppService(mediaRelationsServiceToken);
  const queryKey = queryCacheConfig.families.mediaRelations.key(
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

      return service.getMediaRelations(accessToken, mediaId, signal);
    },
  });
}
