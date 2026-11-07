import { useMemo } from "react";

import type { InfiniteData } from "@tanstack/react-query";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { myListServiceToken } from "@/entities/media";
import type { AccountState } from "@/entities/account";
import { filterMediaForContentMode } from "@/entities/media";
import { mediaRecommendationsServiceToken } from "@/entities/media";
import { MEDIA_RECOMMENDATION_SOURCE_BATCH_SIZE } from "@/entities/media";
import type {
  Media,
  MyListEntry,
  MediaContentMode,
  MediaRecommendationSort,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

type RecommendationBatch = {
  items: Media[];
  sourceIds: number[];
};

function compareDescending(
  first: null | number,
  second: null | number,
): number {
  if (first === null && second === null) return 0;
  if (first === null) return 1;
  if (second === null) return -1;
  return second - first;
}

function getCompletedAnime(entries: MyListEntry[]): MyListEntry[] {
  return [
    ...new Map(
      entries
        .filter((entry) => entry.status === "COMPLETED")
        .map((entry) => [entry.id, entry] as const),
    ).values(),
  ];
}

function sortCompletedAnime(entries: MyListEntry[]): MyListEntry[] {
  const completedEntries = getCompletedAnime(entries);

  return completedEntries.sort((first, second) => {
    const favorite =
      Number(Boolean(second.isFavorite)) - Number(Boolean(first.isFavorite));
    if (favorite !== 0) return favorite;

    const firstHasUserScore = first.score !== null && first.score > 0;
    const secondHasUserScore = second.score !== null && second.score > 0;
    if (firstHasUserScore !== secondHasUserScore) {
      return Number(secondHasUserScore) - Number(firstHasUserScore);
    }
    const userScore = compareDescending(first.score, second.score);
    if (userScore !== 0) return userScore;

    const averageScore = compareDescending(
      first.averageScore,
      second.averageScore,
    );
    return averageScore || first.id - second.id;
  });
}

function shuffleEntries(entries: MyListEntry[], seed: number): MyListEntry[] {
  const shuffledEntries = [...entries];
  let randomState = seed >>> 0;

  for (let index = shuffledEntries.length - 1; index > 0; index -= 1) {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    const swapIndex = Math.floor((randomState / 0x1_0000_0000) * (index + 1));
    [shuffledEntries[index], shuffledEntries[swapIndex]] = [
      shuffledEntries[swapIndex],
      shuffledEntries[index],
    ];
  }

  return shuffledEntries;
}

type UseListRecommendationsParams = {
  random: boolean;
  randomSeed: number;
  contentMode: MediaContentMode;
  sort: MediaRecommendationSort;
  account: AccountState["account"];
};

export function useListRecommendations({
  sort,
  random,
  account,
  randomSeed,
  contentMode,
}: UseListRecommendationsParams) {
  const { accessToken } = useAuth();
  const listService = useAppService(myListServiceToken);
  const recommendationsService = useAppService(
    mediaRecommendationsServiceToken,
  );
  const userId = account?.id ?? "";

  const listQuery = useQuery({
    throwOnError: true,
    enabled: Boolean(accessToken && userId),
    queryKey: queryCacheConfig.families.userList.key(userId),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, userId, signal),
  });

  const sourceAnime = useMemo(() => {
    const entries = listQuery.data?.flatMap(({ list }) => list) ?? [];
    const visibleEntries = filterMediaForContentMode(entries, contentMode);

    return random
      ? shuffleEntries(getCompletedAnime(visibleEntries), randomSeed)
      : sortCompletedAnime(visibleEntries);
  }, [contentMode, listQuery.data, random, randomSeed]);

  const recommendationsFamily = queryCacheConfig.families.listRecommendations;
  const recommendationsQuery = useInfiniteQuery<
    RecommendationBatch,
    Error,
    InfiniteData<RecommendationBatch>,
    readonly unknown[],
    number[]
  >({
    throwOnError: true,
    initialPageParam: [],
    gcTime: recommendationsFamily.gcTimeMs,
    staleTime: recommendationsFamily.staleTimeMs,
    enabled: Boolean(
      accessToken &&
      userId &&
      !listQuery.isPending &&
      !listQuery.isFetching &&
      sourceAnime.length > 0,
    ),
    queryKey: random
      ? [...recommendationsFamily.key(userId, sort, contentMode), randomSeed]
      : recommendationsFamily.key(userId, sort, contentMode),
    getNextPageParam: (_lastBatch, batches) => {
      const loadedSourceIds = new Set(
        batches.flatMap(({ sourceIds }) => sourceIds ?? []),
      );
      const nextSourceIds = sourceAnime
        .filter(({ id }) => !loadedSourceIds.has(id))
        .slice(0, MEDIA_RECOMMENDATION_SOURCE_BATCH_SIZE)
        .map(({ id }) => id);

      return nextSourceIds.length > 0 ? nextSourceIds : undefined;
    },
    queryFn: async ({ signal, pageParam }) => {
      if (!accessToken) {
        throw new Error("An authenticated AniList session is required.");
      }
      const sourceMediaIds =
        pageParam.length > 0
          ? pageParam
          : sourceAnime
              .slice(0, MEDIA_RECOMMENDATION_SOURCE_BATCH_SIZE)
              .map(({ id }) => id);
      const items =
        await recommendationsService.getMediaRecommendationsForSources(
          accessToken,
          sourceMediaIds,
          sort,
          signal,
        );

      return {
        sourceIds: sourceMediaIds,
        items: filterMediaForContentMode(items, contentMode),
      };
    },
  });

  const items = useMemo(() => {
    const seenIds = new Set<number>();
    const listedMediaIds = new Set(
      (listQuery.data ?? []).flatMap(({ list }) => list.map(({ id }) => id)),
    );
    return (recommendationsQuery.data?.pages ?? []).flatMap(
      ({ items: batchItems }) =>
        batchItems.filter((item) => {
          if (seenIds.has(item.id) || listedMediaIds.has(item.id)) return false;
          seenIds.add(item.id);
          return true;
        }),
    );
  }, [listQuery.data, recommendationsQuery.data]);

  return { items, listQuery, sourceAnime, recommendationsQuery };
}
