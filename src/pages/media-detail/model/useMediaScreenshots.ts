import { useQuery } from "@tanstack/react-query";

import { mediaScreenshotsServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseMediaScreenshotsParameters = {
  mediaId: number;
  fallbackMalId: null | number | undefined;
};

/** Loads Shikimori frames through the media external-ID resolver. */
export function useMediaScreenshots({
  mediaId,
  fallbackMalId,
}: UseMediaScreenshotsParameters) {
  const service = useAppService(mediaScreenshotsServiceToken);
  const safeFallbackMalId = fallbackMalId ?? null;

  return useQuery({
    enabled: Number.isFinite(mediaId) && mediaId > 0,
    queryFn: ({ signal }) =>
      service.getScreenshots(mediaId, safeFallbackMalId, signal),
    queryKey: queryCacheConfig.families.mediaScreenshots.key(
      mediaId,
      safeFallbackMalId,
    ),
  });
}
