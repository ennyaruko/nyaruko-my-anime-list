import { useMemo } from "react";

import type { InfiniteData } from "@tanstack/react-query";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { AccountState } from "@/entities/account";
import { myListServiceToken, mediaSearchServiceToken } from "@/entities/media";
import type {
  Media,
  MediaSearchResult,
  MediaSearchParameters,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseSearchResultsParams = {
  account: AccountState["account"];
  parameters: MediaSearchParameters;
};

export function useSearchResults({
  account,
  parameters,
}: UseSearchResultsParams) {
  const { accessToken } = useAuth();
  const searchService = useAppService(mediaSearchServiceToken);
  const myListService = useAppService(myListServiceToken);

  const searchQuery = useInfiniteQuery<
    MediaSearchResult,
    Error,
    InfiniteData<MediaSearchResult>,
    ReturnType<typeof queryCacheConfig.families.mediaSearch.key>,
    number
  >({
    initialPageParam: 1,
    gcTime: queryCacheConfig.families.mediaSearch.gcTimeMs,
    queryKey: queryCacheConfig.families.mediaSearch.key(parameters),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
    queryFn: ({ signal, pageParam }) =>
      searchService.searchMedia(
        {
          ...parameters,
          page: pageParam,
        },
        signal,
      ),
  });

  const myListQuery = useQuery({
    enabled: Boolean(accessToken && account?.id),
    queryKey: queryCacheConfig.families.userList.key(account?.id ?? ""),
    queryFn: ({ signal }) =>
      myListService.getMyList(accessToken!, account!.id, signal),
  });

  const listEntriesByMediaId = useMemo(
    () =>
      new Map(
        myListQuery.data
          ?.flatMap(({ list }) => list)
          .map((entry) => [entry.id, entry] as const) ?? [],
      ),
    [myListQuery.data],
  );

  const results = useMemo(
    () =>
      searchQuery.data?.pages
        .flatMap(({ items }) => items)
        .map((media): Media => {
          const listEntry = listEntriesByMediaId.get(media.id);

          return {
            ...media,
            score: listEntry?.score ?? null,
            status: listEntry?.status ?? null,
            listEntryId: listEntry?.listEntryId ?? null,
            progress:
              listEntry?.progress ??
              (listEntry?.status === "CURRENT" ? 0 : null),
          };
        }) ?? [],
    [listEntriesByMediaId, searchQuery.data],
  );
  const loadMore = () => {
    if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
      void searchQuery.fetchNextPage();
    }
  };

  return {
    results,
    loadMore,
    isPending: searchQuery.isPending,
    isFetchingNextPage: searchQuery.isFetchingNextPage,
  };
}
