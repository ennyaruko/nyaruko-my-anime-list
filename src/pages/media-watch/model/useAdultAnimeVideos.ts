import { useQuery } from "@tanstack/react-query";

import type { AdultVideoSource } from "@/entities/adult-anime";
import {
  adultAnimeVideosServiceToken,
  muchoHentaiAdultAnimeVideosServiceToken,
} from "@/entities/adult-anime";

import { useAppService, queryCacheConfig } from "@/shared/lib";

export function useAdultAnimeVideos(
  titles: readonly string[],
  source: AdultVideoSource,
  enabled = true,
) {
  const serviceToken =
    source === "mucho-hentai"
      ? muchoHentaiAdultAnimeVideosServiceToken
      : adultAnimeVideosServiceToken;
  const service = useAppService(serviceToken);

  const searchTitles = [
    ...new Map(
      titles
        .map((title) => title.trim())
        .filter(Boolean)
        .map((title) => [title.toLocaleLowerCase(), title] as const),
    ).values(),
  ];
  const searchKey = JSON.stringify(searchTitles);

  return useQuery({
    enabled: enabled && searchTitles.length > 0,
    queryKey: queryCacheConfig.families.adultAnimeVideos.key(searchKey, source),
    queryFn: async ({ signal }) => {
      const results = await Promise.allSettled(
        searchTitles.map((title) => service.searchByTitle(title, signal)),
      );
      const successfulResults = results.flatMap((result) =>
        result.status === "fulfilled" ? [result.value] : [],
      );
      if (successfulResults.length === 0) {
        const failure = results.find((result) => result.status === "rejected");
        if (failure?.status === "rejected") throw failure.reason;
        return [];
      }

      return [
        ...new Map(
          successfulResults.flat().map((video) => [video.id, video] as const),
        ).values(),
      ];
    },
  });
}
