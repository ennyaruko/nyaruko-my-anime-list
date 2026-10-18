import { type Query, QueryClient } from "@tanstack/react-query";

import { shouldPersistQuery as shouldPersistByKey } from "../../lib";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: 0 },
    queries: {
      staleTime: 5 * 60 * 1_000,
      refetchOnWindowFocus: true,
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

export async function clearUserQueries(
  userId?: string | number,
): Promise<void> {
  queryClient.removeQueries({
    predicate: (query) => {
      const [category, cachedUserId] = query.queryKey;
      return (
        category === "user-list" &&
        (userId === undefined || String(cachedUserId) === String(userId))
      );
    },
  });
}
