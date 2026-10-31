import { getQueryFamily } from "./query-cache-policy";

/**
 * Вспомогательные проверки уже созданных query keys.
 *
 * Фабрики ключей вместе с cache-политикой семейств описаны в
 * `shared/react-query/query-cache.ts`; здесь нет второго списка ключей.
 */

/** Возвращает ID пользователя из семейства, объявленного как user-scoped. */
export function getUserIdFromQueryKey(
  queryKey: readonly unknown[],
): null | string {
  const userIdIndex = getQueryFamily(queryKey)?.userIdIndex;
  if (userIdIndex === undefined) return null;

  const userId = queryKey[userIdIndex];
  if (
    (typeof userId !== "string" && typeof userId !== "number") ||
    String(userId).trim().length === 0
  ) {
    return null;
  }
  return String(userId);
}

/** Проверяет, объявлено ли семейство ключа как user-scoped. */
export function isUserScopedQueryKey(queryKey: readonly unknown[]): boolean {
  return getUserIdFromQueryKey(queryKey) !== null;
}
