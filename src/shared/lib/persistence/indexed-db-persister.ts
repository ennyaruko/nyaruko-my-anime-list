import { del, get, set, createStore } from "idb-keyval";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const database = createStore("my-anime-list", "persisted-query-cache");

/** IndexedDB stores the dehydrated snapshot; TanStack Query owns cache semantics. */
export const indexedDbQueryPersister = createAsyncStoragePersister({
  throttleTime: 1_000,
  key: "my-anime-list-query-cache",
  storage: {
    getItem: async (key) => {
      try {
        return (await get<string>(key, database)) ?? null;
      } catch {
        return null;
      }
    },
    removeItem: async (key) => {
      try {
        await del(key, database);
      } catch {
        /* Keep the in-memory cache usable. */
      }
    },
    setItem: async (key, value) => {
      try {
        await set(key, value, database);
      } catch {
        /* Persistence is best-effort. */
      }
    },
  },
});
