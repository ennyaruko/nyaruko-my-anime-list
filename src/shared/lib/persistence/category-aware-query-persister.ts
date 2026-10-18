import type {
  Persister,
  PersistedClient,
} from "@tanstack/react-query-persist-client";

import { shouldPersistQuery } from "./query-persistence-policy";
import { indexedDbQueryPersister } from "./indexed-db-persister";

function retainUnexpiredQueries(persistedClient: PersistedClient, now: number) {
  const queries = persistedClient.clientState.queries.filter((query) =>
    shouldPersistQuery(query.queryKey, query.state.dataUpdatedAt, now),
  );
  return {
    queries,
    client: {
      ...persistedClient,
      clientState: { ...persistedClient.clientState, queries },
    },
  };
}

/** Apply category retention both on write and on restore; never renew query data age. */
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
    if (queries.length !== persistedClient.clientState.queries.length) {
      const prunedClient = { ...client, timestamp: Date.now() };
      await indexedDbQueryPersister.persistClient(prunedClient);
      return prunedClient;
    }
    return persistedClient;
  },
};
