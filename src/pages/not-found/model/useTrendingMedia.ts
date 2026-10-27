import { useMemo } from "react";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { AccountState } from "@/entities/account";
import {
  type Media,
  myListServiceToken,
  type MediaSearchResult,
  mediaSearchServiceToken,
  type MediaSearchParameters,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

const trendingParameters: Omit<MediaSearchParameters, "page" | "isAdult"> = {
  tags: [],
  search: "",
  genres: [],
  perPage: 12,
  formats: [],
  sources: [],
  statuses: [],
  sort: "trending",
  formatFilterEnabled: false,
  sourceFilterEnabled: false,
  statusFilterEnabled: false,
};

export function useTrendingMedia({ account }: AccountState) {
  const { accessToken } = useAuth();
  const searchService = useAppService(mediaSearchServiceToken);
  const listService = useAppService(myListServiceToken);
  const parameters: MediaSearchParameters = {
    ...trendingParameters,
    page: 1,
    isAdult: undefined,
  };

  const trendingQuery = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryCacheConfig.families.mediaSearch.key(parameters),
    queryFn: ({ signal, pageParam }) =>
      searchService.searchMedia({ ...parameters, page: pageParam }, signal),
    getNextPageParam: (lastPage: MediaSearchResult, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });

  const listQuery = useQuery({
    enabled: Boolean(accessToken && account?.id),
    queryKey: queryCacheConfig.families.userList.key(account?.id ?? ""),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, account!.id, signal),
  });

  const entriesByMediaId = useMemo(
    () =>
      new Map(
        listQuery.data
          ?.flatMap(({ list }) => list)
          .map((entry) => [entry.id, entry] as const) ?? [],
      ),
    [listQuery.data],
  );

  const media = useMemo(
    () => [
      ...new Map(
        (trendingQuery.data?.pages.flatMap(({ items }) => items) ?? []).map(
          (item) => {
            const entry = entriesByMediaId.get(item.id);
            const media: Media = {
              ...item,
              score: entry?.score ?? null,
              status: entry?.status ?? null,
              listEntryId: entry?.listEntryId ?? null,
              progress:
                entry?.progress ?? (entry?.status === "CURRENT" ? 0 : null),
            };

            return [media.id, media] as const;
          },
        ),
      ).values(),
    ],
    [entriesByMediaId, trendingQuery.data],
  );

  return {
    media,
    isPending: trendingQuery.isPending,
    fetchNextPage: trendingQuery.fetchNextPage,
    hasNextPage: trendingQuery.hasNextPage ?? false,
    isFetchingNextPage: trendingQuery.isFetchingNextPage,
  };
}
