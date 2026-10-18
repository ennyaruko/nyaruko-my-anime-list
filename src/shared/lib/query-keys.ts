/** Canonical query-key factories shared by queries, persistence and cleanup. */
export type ReferenceDataKind = "genres" | "formats" | "seasons" | "statuses";
export const queryKeys = {
  reference: (kind: ReferenceDataKind) => ["reference", kind] as const,
  animeDetails: (animeId: number) => ["anime", "details", animeId] as const,
  account: (providerId: string) => ["identity", "account", providerId] as const,
  userList: (
    userId: string,
    parameters?: Readonly<Record<string, null | string | number | boolean>>,
  ) => ["user-list", userId, parameters] as const,
};

/** All user-scoped keys must start with `user-` and carry the stable user ID at index 1. */
export function getUserIdFromQueryKey(
  queryKey: readonly unknown[],
): null | string {
  const [category, userId] = queryKey;
  if (
    typeof category !== "string" ||
    !category.startsWith("user-") ||
    (typeof userId !== "string" && typeof userId !== "number") ||
    String(userId).length === 0
  ) {
    return null;
  }
  return String(userId);
}

export function isUserScopedQueryKey(queryKey: readonly unknown[]): boolean {
  return getUserIdFromQueryKey(queryKey) !== null;
}
