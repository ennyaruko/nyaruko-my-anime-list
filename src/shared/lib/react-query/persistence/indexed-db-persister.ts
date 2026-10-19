import { del, get, set, createStore } from "idb-keyval";
import type { PersistedClient } from "@tanstack/react-query-persist-client";

import {
  createSerializedPersister,
  type PersistenceOperation,
} from "./serialized-persister";

const database = createStore("my-anime-list", "persisted-query-cache");
const storageKey = "my-anime-list-query-cache-v2";
const legacyStorageKey = "my-anime-list-query-cache";
type PersistenceErrorHandler = (operation: PersistenceOperation) => void;

let onPersistenceError: undefined | PersistenceErrorHandler;

/**
 * Install a privacy-safe diagnostic hook; pass null to restore default
 * console/event reporting. The hook receives only the operation name.
 */
export function setPersistenceErrorHandler(
  handler: null | PersistenceErrorHandler,
): void {
  onPersistenceError = handler ?? undefined;
}

function reportPersistenceError(operation: PersistenceOperation): void {
  try {
    if (onPersistenceError) {
      onPersistenceError(operation);
      return;
    }

    console.warn("[my-anime-list] Browser persistence operation failed", {
      operation,
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("my-anime-list:persistence-error", {
          detail: { operation },
        }),
      );
    }
  } catch {
    // Diagnostics must never make persistence or the app fail.
  }
}

/**
 * IndexedDB stores the dehydrated snapshot; TanStack Query owns cache
 * semantics.
 */
export const indexedDbQueryPersister = createSerializedPersister(
  {
    async write(client) {
      await set(storageKey, client, database);
    },
    async remove() {
      await del(storageKey, database);
      try {
        await del(legacyStorageKey, database);
      } catch {
        // The legacy key is obsolete; its cleanup is best-effort.
      }
    },
    async read() {
      // Previous versions stored a JSON string; v2 stores a structured object.
      // Discard the legacy key instead of interpreting it as a snapshot.
      try {
        await del(legacyStorageKey, database);
      } catch {
        // Legacy cleanup is best-effort and does not block v2 cache reads.
      }
      return (await get<PersistedClient>(storageKey, database)) ?? undefined;
    },
  },
  reportPersistenceError,
);
