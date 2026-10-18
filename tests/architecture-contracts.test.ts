import { it, expect, describe } from "vitest";
import type { PersistedClient } from "@tanstack/react-query-persist-client";

import { createServiceToken } from "../src/shared/lib/app-services/service-token";
import { createServiceRegistry } from "../src/shared/lib/app-services/service-registry";
import { createSerializedPersister } from "../src/shared/lib/persistence/serialized-persister";
import { retainUnexpiredQueries } from "../src/shared/lib/persistence/category-aware-query-persister";
import {
  queryKeys,
  isUserScopedQueryKey,
  getUserIdFromQueryKey,
} from "../src/shared/lib/query-keys";
import {
  queryRetentionMs,
  shouldPersistQuery,
  getQueryRetentionMs,
} from "../src/shared/lib/persistence/query-persistence-policy";

describe("application architecture contracts", () => {
  describe("service registry", () => {
    it("binds registered implementations to tokens and rejects duplicates", () => {
      const token = createServiceToken<{ value: string }>("example");
      const service = { value: "registered" };
      const registry = createServiceRegistry().register(token, service).build();

      expect(registry.get(token.key)).toBe(service);
      expect(() =>
        createServiceRegistry()
          .register(token, service)
          .register(token, service),
      ).toThrow(/already registered/);
    });
  });

  describe("query keys", () => {
    it("isolates account keys by ephemeral session", () => {
      const first = queryKeys.account("anilist", "session-a");
      const second = queryKeys.account("anilist", "session-b");

      expect(first).not.toEqual(second);
      expect(first).not.toContain("access-token");
    });

    it("requires a stable non-empty user identifier for user-scoped keys", () => {
      expect(getUserIdFromQueryKey(queryKeys.userList("123"))).toBe("123");
      expect(isUserScopedQueryKey(["user-settings", "123"])).toBe(true);
      expect(getUserIdFromQueryKey(["user-list", ""])).toBeNull();
      expect(isUserScopedQueryKey(["anime", "details", 123])).toBe(false);
    });
  });

  describe("query persistence", () => {
    it("allowlists keys and applies retention to query data age", () => {
      const now = 2_000_000_000_000;
      const userListKey = queryKeys.userList("123");
      const detailsKey = queryKeys.animeDetails(42);

      expect(getQueryRetentionMs(userListKey)).toBe(queryRetentionMs.userList);
      expect(getQueryRetentionMs(detailsKey)).toBe(
        queryRetentionMs.animeDetails,
      );
      expect(getQueryRetentionMs(["reference", "arbitrary"])).toBeNull();
      expect(getQueryRetentionMs(["search", "query"])).toBeNull();
      expect(shouldPersistQuery(userListKey, now - 1_000, now)).toBe(true);
      expect(
        shouldPersistQuery(userListKey, now - queryRetentionMs.userList, now),
      ).toBe(false);
      expect(shouldPersistQuery(userListKey, now + 1_000, now)).toBe(false);
      expect(shouldPersistQuery(userListKey, 0, now)).toBe(false);
    });

    it("never retains dehydrated mutations in the persisted snapshot", () => {
      const now = 2_000_000_000_000;
      const persistedClient = {
        buster: "test",
        timestamp: now,
        clientState: {
          mutations: [
            {
              mutationKey: ["user-list", "123", "update"],
              state: { isPaused: true, status: "pending" },
            },
          ],
          queries: [
            {
              queryHash: "user-list-123",
              queryKey: queryKeys.userList("123"),
              state: { dataUpdatedAt: now - 1_000 },
            },
          ],
        },
      } as unknown as PersistedClient;

      const result = retainUnexpiredQueries(persistedClient, now);
      expect(result.client.clientState.queries).toHaveLength(1);
      expect(result.client.clientState.mutations).toEqual([]);
    });

    it("lets logout removal win over in-flight and queued persistence writes", async () => {
      let stored: undefined | PersistedClient;
      let releaseFirstWrite: undefined | (() => void);
      let markFirstWriteStarted: undefined | (() => void);
      const firstWriteStarted = new Promise<void>((resolve) => {
        markFirstWriteStarted = resolve;
      });
      const firstWriteGate = new Promise<void>((resolve) => {
        releaseFirstWrite = resolve;
      });
      let writes = 0;
      const persister = createSerializedPersister(
        {
          async read() {
            return stored;
          },
          async remove() {
            stored = undefined;
          },
          async write(client) {
            writes += 1;
            if (writes === 1) {
              markFirstWriteStarted?.();
              await firstWriteGate;
            }
            stored = client;
          },
        },
        () => undefined,
      );
      const snapshot = {
        buster: "test",
        timestamp: Date.now(),
        clientState: { queries: [], mutations: [] },
      } as PersistedClient;

      const inFlightWrite = persister.persistClient(snapshot);
      await firstWriteStarted;
      const queuedWrite = persister.persistClient(snapshot);
      const logoutRemoval = persister.removeClient();
      releaseFirstWrite?.();
      await Promise.all([inFlightWrite, queuedWrite, logoutRemoval]);

      expect(stored).toBeUndefined();
      expect(writes).toBe(1);
    });
  });
});
