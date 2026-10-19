import type {
  Persister,
  PersistedClient,
} from "@tanstack/react-query-persist-client";

import { queryCacheConfig } from "../query-cache";
import { shouldPersistQuery } from "../cache/query-cache-policy";

import { indexedDbQueryPersister } from "./indexed-db-persister";

export function retainUnexpiredQueries(
  persistedClient: PersistedClient,
  now: number,
) {
  const queries = persistedClient.clientState.queries.filter(
    (query) =>
      query.state.status === "success" &&
      query.state.data !== undefined &&
      shouldPersistQuery(query.queryKey, query.state.dataUpdatedAt, now),
  );
  return {
    queries,
    client: {
      ...persistedClient,
      clientState: {
        ...persistedClient.clientState,
        queries,
        // Offline mutations are intentionally not persisted by this app.
        mutations: [],
      },
    },
  };
}

/** Persist only unexpired query data; keep query schemas outside this layer. */
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

    const now = Date.now();
    const { client, queries } = retainUnexpiredQueries(persistedClient, now);
    if (queries.length === 0) {
      await indexedDbQueryPersister.removeClient();
      return undefined;
    }

    const queriesWerePruned =
      queries.length !== persistedClient.clientState.queries.length;
    const mutationsWerePruned =
      persistedClient.clientState.mutations.length > 0;
    const snapshotExpired =
      !Number.isFinite(client.timestamp) ||
      client.timestamp <= 0 ||
      client.timestamp + queryCacheConfig.snapshot.maxAgeMs <= now;

    if (queriesWerePruned || mutationsWerePruned || snapshotExpired) {
      // Refresh only the snapshot envelope. Query timestamps still determine
      // each entry's retention and are never extended by this operation.
      const restoredClient = { ...client, timestamp: now };
      await indexedDbQueryPersister.persistClient(restoredClient);
      return restoredClient;
    }

    return client;
  },
};
