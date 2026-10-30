import { useQuery } from "@tanstack/react-query";

import type { MediaDetail } from "@/entities/media";
import { mediaScreenshotsServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseMediaScreenshotsParameters = {
  detail: undefined | MediaDetail;
};

/** Loads Shikimori screenshots first and uses YummyAni when none are available. */
export function useMediaScreenshots({ detail }: UseMediaScreenshotsParameters) {
  const service = useAppService(mediaScreenshotsServiceToken);
  const mediaId = detail?.media.id ?? 0;
  const malId = detail?.malId ?? null;

  return useQuery({
    queryFn: ({ signal }) => service.getScreenshots(detail!, signal),
    enabled: Boolean(detail && Number.isFinite(mediaId) && mediaId > 0),
    queryKey: queryCacheConfig.families.mediaScreenshots.key(mediaId, malId),
  });
}
