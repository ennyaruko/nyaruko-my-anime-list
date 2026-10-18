import type { ReactNode } from "react";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import {
  QueryClientProvider,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

import { queryClient, shouldPersistQuery } from "@/shared/api";
import {
  maxPersistedCacheAge,
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
        buster: "my-anime-list-v1",
        maxAge: maxPersistedCacheAge,
        persister: categoryAwareQueryPersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) && shouldPersistQuery(query),
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
