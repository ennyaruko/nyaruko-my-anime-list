import { useQuery } from "@tanstack/react-query";

import { adultAnimeVideosServiceToken } from "@/entities/adult-anime";

import { useAppService, queryCacheConfig } from "@/shared/lib";

export function useAdultAnimeVideos(title: string) {
  const service = useAppService(adultAnimeVideosServiceToken);

  return useQuery({
    enabled: title.length > 0,
    queryFn: ({ signal }) => service.searchByTitle(title, signal),
    queryKey: queryCacheConfig.families.adultAnimeVideos.key(title),
  });
}
