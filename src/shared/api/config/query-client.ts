import { type Query, QueryClient } from "@tanstack/react-query";

import { getUserIdFromQueryKey } from "../../lib/query-keys";
import { shouldPersistQuery as shouldPersistByKey } from "../../lib";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: 0 },
    queries: {
      staleTime: 5 * 60 * 1_000,
      refetchOnWindowFocus: true,
      // TanStack Query requires gcTime >= persisted maxAge for reliable hydration.
      // Category-specific persistent retention still prunes individual queries.
      gcTime: 90 * 24 * 60 * 60 * 1_000,
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

/** Remove every query whose key follows the user-scoped key contract. */
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
