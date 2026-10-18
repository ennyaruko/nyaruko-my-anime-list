import { useCallback, type ReactNode } from "react";

import { AuthProvider } from "@/entities/auth";

import { queryKeys, queryClient, clearUserQueries } from "@/shared/api";
import {
  isUserScopedQueryKey,
  categoryAwareQueryPersister,
} from "@/shared/lib";

/** Coordinates auth lifecycle with app-owned query cache and persistence. */
export function AppAuthProvider({ children }: { children: ReactNode }) {
  const handleLogout = useCallback(
    async (providerId: string, sessionId: null | string) => {
      const accountKey = queryKeys.account(providerId, sessionId);
      const isCurrentAccountQuery = (queryKey: readonly unknown[]) =>
        queryKey.length === accountKey.length &&
        queryKey.every((part, index) => part === accountKey[index]);

      // Stop in-flight requests before removing their cache entries.
      await queryClient
        .cancelQueries({
          predicate: (query) =>
            isUserScopedQueryKey(query.queryKey) ||
            isCurrentAccountQuery(query.queryKey),
        })
        .catch(() => undefined);
      clearUserQueries();
      queryClient.removeQueries({ exact: true, queryKey: accountKey });
      // Pending mutations are session-bound by default; never let a mutation
      // from the previous identity continue into the next session.
      queryClient.getMutationCache().clear();

      // Clear invalidates earlier queued writes before deleting the snapshot.
      await categoryAwareQueryPersister.removeClient();
    },
    [],
  );

  return <AuthProvider onLogout={handleLogout}>{children}</AuthProvider>;
}
