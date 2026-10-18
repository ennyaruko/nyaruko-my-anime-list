import type {
  Persister,
  PersistedClient,
} from "@tanstack/react-query-persist-client";

export type PersistenceOperation = "read" | "write" | "remove";
export type PersistenceStorage = {
  remove(): Promise<void>;
  read(): Promise<undefined | PersistedClient>;
  write(client: PersistedClient): Promise<void>;
};

/**
 * Serializes persistence I/O and makes clear operations win over queued writes.
 * The generation increments synchronously, before deletion enters the queue.
 */
export function createSerializedPersister(
  storage: PersistenceStorage,
  reportError: (operation: PersistenceOperation) => void,
): Persister {
  let generation = 0;
  let operationQueue: Promise<unknown> = Promise.resolve();

  function enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = operationQueue.then(operation, operation);
    operationQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  return {
    async removeClient() {
      generation += 1;
      await enqueue(async () => {
        try {
          await storage.remove();
        } catch {
          reportError("remove");
        }
      });
    },

    async persistClient(client) {
      const requestGeneration = generation;
      await enqueue(async () => {
        if (requestGeneration !== generation) return;
        try {
          await storage.write(client);
        } catch {
          reportError("write");
        }
      });
    },

    async restoreClient() {
      const requestGeneration = generation;
      return enqueue(async () => {
        try {
          const client = await storage.read();
          return requestGeneration === generation ? client : undefined;
        } catch {
          reportError("read");
          return undefined;
        }
      });
    },
  };
}
