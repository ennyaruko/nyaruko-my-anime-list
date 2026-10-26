import type { Query } from "@tanstack/react-query";

import { queryCacheConfig } from "../query-cache";
import { getUserIdFromQueryKey } from "../cache/query-key-utils";
import {
  resolveQueryCachePolicy,
  shouldPersistQuery as shouldPersistByKey,
} from "../cache/query-cache-policy";

import { getQueryClient } from "./getQueryClient";

export const queryClient = getQueryClient({
  defaultOptions: {
    mutations: { retry: 0 },
    queries: {
      // Keep gcTime >= snapshot maxAge and below the browser timer limit.
      gcTime: queryCacheConfig.snapshot.maxAgeMs,
      refetchOnMount: queryCacheConfig.refetchOnMount,
      refetchOnWindowFocus: queryCacheConfig.refetchOnWindowFocus,
      staleTime: (query) => resolveQueryCachePolicy(query.queryKey).staleTimeMs,
      retry: (failureCount, error) => {
        const apiError = error as {
          status?: number;
          response?: { status?: number };
        };
        const status = apiError.status ?? apiError.response?.status;

        return (
          failureCount < 2 && status !== 401 && status !== 403 && status !== 429
        );
      },
    },
  },
});

export function shouldPersistQuery(query: Query): boolean {
  return (
    query.state.status === "success" &&
    shouldPersistByKey(query.queryKey, query.state.dataUpdatedAt)
  );
}

/** Removes every query whose key follows the user-scoped key contract. */
export function clearUserQueries(userId?: string | number): void {
  queryClient.removeQueries({
    predicate: (query) => {
      const cachedUserId = getUserIdFromQueryKey(query.queryKey);

      return (
        cachedUserId !== null &&
        (userId === undefined || cachedUserId === String(userId))
      );
    },
  });
}
