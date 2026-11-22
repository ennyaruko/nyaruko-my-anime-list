import { useQuery } from "@tanstack/react-query";

import type { MediaDetail } from "@/entities/media";
import { mediaShikimoriInfoServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseShikimoriMediaInfoParameters = {
  detail: undefined | MediaDetail;
};

/** Loads optional Shikimori metadata for the anime information section. */
export function useShikimoriMediaInfo({
  detail,
}: UseShikimoriMediaInfoParameters) {
  const service = useAppService(mediaShikimoriInfoServiceToken);
  const mediaId = detail?.media.id ?? 0;
  const malId = detail?.malId ?? null;

  return useQuery({
    queryFn: ({ signal }) => service.getInfo(detail!, signal),
    enabled: Boolean(detail && Number.isFinite(mediaId) && mediaId > 0),
    queryKey: queryCacheConfig.families.mediaShikimoriInfo.key(mediaId, malId),
  });
}
