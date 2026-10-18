import type { ReactNode } from "react";

import { AuthProvider } from "@/entities/auth";

import { categoryAwareQueryPersister } from "@/shared/lib";
import { queryKeys, queryClient, clearUserQueries } from "@/shared/api";

/** Coordinates auth lifecycle with app-owned query cache and persistence. */
export function AppAuthProvider({ children }: { children: ReactNode }) {
  const handleLogout = async (providerId: string) => {
    clearUserQueries();
    queryClient.removeQueries({ queryKey: queryKeys.account(providerId) });
    // Clearing the persisted snapshot prevents a prior account's private data
    // surviving a logout if the browser closes before the next throttled write.
    await categoryAwareQueryPersister.removeClient();
  };

  return <AuthProvider onLogout={handleLogout}>{children}</AuthProvider>;
}
