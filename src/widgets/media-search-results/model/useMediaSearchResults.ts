import { useMemo } from "react";

import type { InfiniteData } from "@tanstack/react-query";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { AccountState } from "@/entities/account";
import { isMediaVisibleInContentMode } from "@/entities/media";
import { myListServiceToken, mediaSearchServiceToken } from "@/entities/media";
import type {
  Media,
  MediaSearchResult,
  MediaSearchParameters,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type UseSearchResultsParams = {
  initialPage?: number;
  account: AccountState["account"];
  parameters: MediaSearchParameters;
};

export function useMediaSearchResults({
  account,
  parameters,
  initialPage = 1,
}: UseSearchResultsParams) {
  const { accessToken } = useAuth();
  const searchService = useAppService(mediaSearchServiceToken);
  const myListService = useAppService(myListServiceToken);
  const queryKey = queryCacheConfig.families.mediaSearch.key({
    ...parameters,
    initialPage,
  });

  const searchQuery = useInfiniteQuery<
    MediaSearchResult,
    Error,
    InfiniteData<MediaSearchResult>,
    readonly unknown[],
    number
  >({
    queryKey,
    initialPageParam: initialPage,
    gcTime: queryCacheConfig.families.mediaSearch.gcTimeMs,
    staleTime: queryCacheConfig.families.mediaSearch.staleTimeMs,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.hasNextPage ? lastPageParam + 1 : undefined,
    queryFn: ({ signal, pageParam }) =>
      searchService.searchMedia(
        {
          ...parameters,
          page: pageParam,
        },
        { signal },
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

  const pages = useMemo(
    () =>
      searchQuery.data?.pages.map(({ items }, pageIndex) => ({
        page: searchQuery.data!.pageParams[pageIndex] as number,
        items: items
          .filter((media) =>
            isMediaVisibleInContentMode(media, parameters.contentMode),
          )
          .map((media): Media => {
            const listEntry = listEntriesByMediaId.get(media.id);

            return {
              ...media,
              score: listEntry?.score ?? null,
              status: listEntry?.status ?? null,
              listEntryId: listEntry?.listEntryId ?? null,
              progress:
                listEntry?.progress ??
                (listEntry?.status === "CURRENT" ||
                listEntry?.status === "REPEATING"
                  ? 0
                  : null),
            };
          }),
      })) ?? [],
    [listEntriesByMediaId, parameters.contentMode, searchQuery.data],
  );
  const loadMore = () => {
    if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
      void searchQuery.fetchNextPage();
    }
  };

  return {
    pages,
    loadMore,
    isPending: searchQuery.isPending,
    results: pages.flatMap(({ items }) => items),
    isFetchingNextPage: searchQuery.isFetchingNextPage,
  };
}
