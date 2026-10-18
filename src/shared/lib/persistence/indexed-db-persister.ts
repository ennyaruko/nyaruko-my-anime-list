import { del, get, set, createStore } from "idb-keyval";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const database = createStore("my-anime-list", "persisted-query-cache");
type PersistenceOperation = "read" | "write" | "remove";
type PersistenceErrorHandler = (operation: PersistenceOperation) => void;
let onPersistenceError: PersistenceErrorHandler = (operation) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("my-anime-list:persistence-error", {
        detail: { operation },
      }),
    );
  }
};

/** Install a privacy-safe diagnostic hook; never expose cached data or secrets. */
export function setPersistenceErrorHandler(
  handler: PersistenceErrorHandler,
): void {
  onPersistenceError = handler;
}

function reportPersistenceError(operation: PersistenceOperation): void {
  try {
    onPersistenceError(operation);
  } catch {
    // Diagnostics must never make persistence or the app fail.
  }
}

/**
 * IndexedDB stores the dehydrated snapshot; TanStack Query owns cache semantics.
 */
export const indexedDbQueryPersister = createAsyncStoragePersister({
  throttleTime: 1_000,
  key: "my-anime-list-query-cache",
  storage: {
    removeItem: async (key) => {
      try {
        await del(key, database);
      } catch {
        reportPersistenceError("remove");
      }
    },
    setItem: async (key, value) => {
      try {
        await set(key, value, database);
      } catch {
        reportPersistenceError("write");
      }
    },
    getItem: async (key) => {
      try {
        return (await get<string>(key, database)) ?? null;
      } catch {
        reportPersistenceError("read");
        return null;
      }
    },
  },
});
