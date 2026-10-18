/** Canonical query-key factories shared by queries, persistence and cleanup. */
export type ReferenceDataKind = "genres" | "formats" | "seasons" | "statuses";
export type UserListParameters = Readonly<
  Record<string, null | string | number | boolean>
>;

export const queryKeys = {
  reference: (kind: ReferenceDataKind) => ["reference", kind] as const,
  animeDetails: (animeId: number) => ["anime", "details", animeId] as const,
  userList: (userId: string, parameters?: UserListParameters) =>
    ["user-list", userId, parameters] as const,
  /** Session-scoped: the account is unknown until the current session is queried. */
  account: (providerId: string, sessionId: null | string) =>
    ["identity", "account", providerId, sessionId] as const,
};

/** All user-scoped keys start with `user-` and carry a stable user ID at index 1. */
export function getUserIdFromQueryKey(
  queryKey: readonly unknown[],
): null | string {
  const [category, userId] = queryKey;
  if (
    typeof category !== "string" ||
    !category.startsWith("user-") ||
    (typeof userId !== "string" && typeof userId !== "number") ||
    String(userId).trim().length === 0
  ) {
    return null;
  }
  return String(userId);
}

export function isUserScopedQueryKey(queryKey: readonly unknown[]): boolean {
  return getUserIdFromQueryKey(queryKey) !== null;
}
