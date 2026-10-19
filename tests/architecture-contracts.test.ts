import { it, expect, describe } from "vitest";
import type { PersistedClient } from "@tanstack/react-query-persist-client";

import { queryCacheConfig } from "../src/shared/config";
import { createServiceToken } from "../src/shared/lib/app-services/service-token";
import { createServiceRegistry } from "../src/shared/lib/app-services/service-registry";
import { createSerializedPersister } from "../src/shared/lib/persistence/serialized-persister";
import {
  isUserScopedQueryKey,
  getUserIdFromQueryKey,
} from "../src/shared/lib/query-key-utils";
import { retainUnexpiredQueries } from "../src/shared/lib/persistence/category-aware-query-persister";
import {
  shouldPersistQuery,
  resolveQueryCachePolicy,
} from "../src/shared/lib/query-cache-policy";

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
      const first = queryCacheConfig.families.account.key(
        "anilist",
        "session-a",
      );
      const second = queryCacheConfig.families.account.key(
        "anilist",
        "session-b",
      );

      expect(first).not.toEqual(second);
      expect(first).not.toContain("access-token");
    });

    it("requires a stable non-empty user identifier for user-scoped keys", () => {
      expect(
        getUserIdFromQueryKey(queryCacheConfig.families.userList.key("123")),
      ).toBe("123");
      expect(
        isUserScopedQueryKey(queryCacheConfig.families.userList.key("123")),
      ).toBe(true);
      expect(isUserScopedQueryKey(["user-settings", "123"])).toBe(false);
      expect(
        getUserIdFromQueryKey(queryCacheConfig.families.userList.key("")),
      ).toBeNull();
      expect(isUserScopedQueryKey(["anime", "details", 123])).toBe(false);
    });
  });

  describe("query persistence", () => {
    it("allowlists keys and applies retention to query data age", () => {
      const now = 2_000_000_000_000;
      const userListKey = queryCacheConfig.families.userList.key("123");
      const detailsKey = queryCacheConfig.families.animeDetails.key(42);

      const userListPolicy = resolveQueryCachePolicy(userListKey);
      const detailsPolicy = resolveQueryCachePolicy(detailsKey);
      expect(userListPolicy.persistForMs).toBe(90 * 24 * 60 * 60 * 1_000);
      expect(detailsPolicy.persistForMs).toBe(30 * 24 * 60 * 60 * 1_000);
      expect(userListPolicy.staleTimeMs).toBe(24 * 60 * 60 * 1_000);
      expect(
        resolveQueryCachePolicy(["reference", "arbitrary"]).persistForMs,
      ).toBeNull();
      expect(resolveQueryCachePolicy(["search", "query"]).persistForMs).toBe(
        null,
      );
      expect(shouldPersistQuery(userListKey, now - 1_000, now)).toBe(true);
      expect(
        shouldPersistQuery(
          userListKey,
          now - (userListPolicy.persistForMs ?? 0),
          now,
        ),
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
              queryKey: queryCacheConfig.families.userList.key("123"),
              state: {
                data: [],
                status: "success",
                dataUpdatedAt: now - 1_000,
              },
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
