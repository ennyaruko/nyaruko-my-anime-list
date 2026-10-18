import type {
  Persister,
  PersistedClient,
} from "@tanstack/react-query-persist-client";

import { shouldPersistQuery } from "./query-persistence-policy";
import { indexedDbQueryPersister } from "./indexed-db-persister";

export function retainUnexpiredQueries(
  persistedClient: PersistedClient,
  now: number,
) {
  const queries = persistedClient.clientState.queries.filter((query) =>
    shouldPersistQuery(query.queryKey, query.state.dataUpdatedAt, now),
  );
  return {
    queries,
    client: {
      ...persistedClient,
      clientState: {
        ...persistedClient.clientState,
        queries,
        // The application has no durable offline mutation queue. Dropping
        // mutations here is a second line of defence beyond dehydrateOptions.
        mutations: [],
      },
    },
  };
}

/**
 * Apply category retention both on write and on restore. Query data age is
 * never renewed by pruning the snapshot, and mutations are never persisted.
 */
export const categoryAwareQueryPersister: Persister = {
  removeClient: () => indexedDbQueryPersister.removeClient(),
  async persistClient(persistedClient) {
    const { client, queries } = retainUnexpiredQueries(
      persistedClient,
      Date.now(),
    );
    if (queries.length === 0) {
      await indexedDbQueryPersister.removeClient();
      return;
    }
    await indexedDbQueryPersister.persistClient(client);
  },
  async restoreClient() {
    const persistedClient = await indexedDbQueryPersister.restoreClient();
    if (!persistedClient) return undefined;
    const { client, queries } = retainUnexpiredQueries(
      persistedClient,
      Date.now(),
    );
    if (queries.length === 0) {
      await indexedDbQueryPersister.removeClient();
      return undefined;
    }
    const queriesWerePruned =
      queries.length !== persistedClient.clientState.queries.length;
    const mutationsWerePruned =
      persistedClient.clientState.mutations.length > 0;

    if (queriesWerePruned || mutationsWerePruned) {
      // Refresh the snapshot timestamp only because its contents changed;
      // each query's dataUpdatedAt remains untouched and governs retention.
      const prunedClient = { ...client, timestamp: Date.now() };
      await indexedDbQueryPersister.persistClient(prunedClient);
      return prunedClient;
    }
    return client;
  },
};
