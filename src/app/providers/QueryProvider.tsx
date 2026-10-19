import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import {
  queryClient,
  queryCacheConfig,
  shouldPersistQuery,
  categoryAwareQueryPersister,
} from "@/shared/lib";

export function QueryProvider({ children }: { children: ReactNode }) {
  // Keep server rendering independent from the browser-only IndexedDB persister.
  if (typeof window === "undefined") {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: categoryAwareQueryPersister,
        buster: queryCacheConfig.snapshot.buster,
        maxAge: queryCacheConfig.snapshot.maxAgeMs,
        dehydrateOptions: {
          // Offline mutation replay is not part of the MVP. Never persist
          // paused or otherwise dehydrated mutations across browser sessions.
          shouldDehydrateMutation: () => false,
          shouldDehydrateQuery: shouldPersistQuery,
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
