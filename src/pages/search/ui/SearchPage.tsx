import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { useRef, useMemo, useState, useEffect } from "react";

import type { InfiniteData } from "@tanstack/react-query";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { MediaSearchFilters } from "@/features/filters";

import { useAuth } from "@/entities/auth";
import type { AccountState } from "@/entities/account";
import { filterOptionsProviderToken } from "@/entities/filters";
import type {
  Media,
  MediaSearchResult,
  MediaSearchParameters,
} from "@/entities/media";
import {
  MediaCard,
  MediaCardSkeleton,
  myListServiceToken,
  mediaSearchServiceToken,
} from "@/entities/media";

import { SearchIcon } from "@/shared/icons";
import { SEARCH_INPUT_FOCUS_EVENT } from "@/shared/lib";
import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Input,
  Column,
  GridList,
  Container,
  Breadcrumbs,
  BlockStatusEmpty,
} from "@/shared/ui";

import * as styles from "./SearchPage.css";

const RESULTS_PER_PAGE = 50;
const SKELETON_COUNT = 6;

type SearchResultsProps = {
  account: AccountState["account"];
  parameters: MediaSearchParameters;
};

function SearchResults({ account, parameters }: SearchResultsProps) {
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
    gcTime: 0,
    initialPageParam: 1,
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
            progress: listEntry?.progress ?? null,
          };
        }) ?? [],
    [listEntriesByMediaId, searchQuery.data],
  );
  const loadMore = () => {
    if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
      void searchQuery.fetchNextPage();
    }
  };
  const skeletons = searchQuery.isFetchingNextPage ? (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <MediaCardSkeleton size="l" key={index} />
      ))}
    </div>
  ) : null;

  return (
    <div className={styles.resultsContainer}>
      {searchQuery.isPending ? (
        <GridList
          renderItem={() => <MediaCardSkeleton size="l" />}
          data={Array.from({ length: SKELETON_COUNT }, (_, index) => index)}
        />
      ) : results.length === 0 ? (
        <BlockStatusEmpty className={styles.empty} />
      ) : (
        <GridList
          virtualize
          data={results}
          footer={skeletons}
          endReached={loadMore}
          getKey={(media) => media.id}
          renderItem={(media) => <MediaCard size="l" media={media} />}
        />
      )}
    </div>
  );
}

export function SearchPage() {
  const { t } = useTranslation(["common"]);
  const { account } = useOutletContext<AccountState>();
  const filterOptionsProvider = useAppService(filterOptionsProviderToken);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    searchInputRef.current?.focus();
    const focusSearchInput = () => searchInputRef.current?.focus();
    window.addEventListener(SEARCH_INPUT_FOCUS_EVENT, focusSearchInput);
    return () =>
      window.removeEventListener(SEARCH_INPUT_FOCUS_EVENT, focusSearchInput);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearchTerm(searchTerm.trim()),
      250,
    );
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const filterOptionsQuery = useQuery({
    enabled: Boolean(account?.id),
    queryFn: ({ signal }) => filterOptionsProvider.getFilterOptions(signal),
    queryKey: queryCacheConfig.families.filters.key(String(account?.id ?? "")),
  });

  return (
    <Container as="main" className={styles.page}>
      <Column gap="m">
        <Breadcrumbs
          items={[
            { to: "/", label: t("common:navigation.myAnime") },
            { label: t("common:navigation.search") },
          ]}
        />
        <Input
          cleanable
          autoComplete="off"
          value={searchTerm}
          variant="grayscale"
          inputRef={searchInputRef}
          onClear={() => setSearchTerm("")}
          placeholder={t("common:search.placeholder")}
          leftSlot={<SearchIcon className={styles.searchIcon} />}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
        <MediaSearchFilters
          userId={account?.id}
          perPage={RESULTS_PER_PAGE}
          search={debouncedSearchTerm}
          options={filterOptionsQuery.data}
          optionsLoading={filterOptionsQuery.isPending}
        >
          {(parameters) => (
            <SearchResults account={account} parameters={parameters} />
          )}
        </MediaSearchFilters>
      </Column>
    </Container>
  );
}
