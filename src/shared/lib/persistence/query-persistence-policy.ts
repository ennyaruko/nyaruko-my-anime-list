import { getUserIdFromQueryKey, type ReferenceDataKind } from "../query-keys";

const DAY = 24 * 60 * 60 * 1_000;

/** Retention by stable server-state category, following ADR-004/ADR-005. */
export const queryRetentionMs = {
  userList: 90 * DAY,
  reference: 90 * DAY,
  animeDetails: 30 * DAY,
} as const;

export const maxPersistedCacheAge = Math.max(
  ...Object.values(queryRetentionMs),
);

const persistedReferenceKinds = new Set<ReferenceDataKind>([
  "genres",
  "formats",
  "statuses",
  "seasons",
]);

export function getQueryRetentionMs(
  queryKey: readonly unknown[],
): null | number {
  const [category, kind, id] = queryKey;

  if (category === "user-list" && getUserIdFromQueryKey(queryKey) !== null) {
    return queryRetentionMs.userList;
  }
  if (
    category === "reference" &&
    typeof kind === "string" &&
    persistedReferenceKinds.has(kind as ReferenceDataKind)
  ) {
    return queryRetentionMs.reference;
  }
  if (category === "anime" && kind === "details" && typeof id === "number") {
    return queryRetentionMs.animeDetails;
  }
  return null;
}

export function shouldPersistQuery(
  queryKey: readonly unknown[],
  dataUpdatedAt: number,
  now = Date.now(),
): boolean {
  const retentionMs = getQueryRetentionMs(queryKey);
  return (
    retentionMs !== null &&
    dataUpdatedAt > 0 &&
    dataUpdatedAt <= now &&
    now - dataUpdatedAt < retentionMs
  );
}
