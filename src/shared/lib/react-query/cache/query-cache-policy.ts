import { queryCacheConfig, type QueryKeyConstraint } from "../query-cache";

type QueryFamily =
  (typeof queryCacheConfig.families)[keyof typeof queryCacheConfig.families];

function matchesConstraint(
  queryKey: readonly unknown[],
  constraint: QueryKeyConstraint,
): boolean {
  const value = queryKey[constraint.index];

  if ("oneOf" in constraint) {
    return constraint.oneOf.some((candidate) => Object.is(candidate, value));
  }

  if (constraint.type === "finite-number") {
    return typeof value === "number" && Number.isFinite(value);
  }

  return typeof value === "string" && value.trim().length > 0;
}

function matchesFamily(
  queryKey: readonly unknown[],
  family: QueryFamily,
): boolean {
  const prefixMatches = family.keyPrefix.every((segment, index) =>
    Object.is(queryKey[index], segment),
  );

  return (
    prefixMatches &&
    family.keyConstraints.every((constraint) =>
      matchesConstraint(queryKey, constraint),
    )
  );
}

/**
 * Возвращает семейство, которому принадлежит query key.
 * Без совпадения возвращает `undefined`; при нескольких совпадениях бросает
 * ошибку конфигурации, чтобы не применять неоднозначную кеш-политику.
 */
export function getQueryFamily(queryKey: readonly unknown[]) {
  const matchingFamilies = Object.entries(queryCacheConfig.families).filter(
    ([, family]) => matchesFamily(queryKey, family),
  );

  if (matchingFamilies.length > 1) {
    const familyNames = matchingFamilies.map(([name]) => name).join(", ");
    throw new Error(
      `Ключ запроса подходит к нескольким семействам кеша: ${familyNames}`,
    );
  }

  return matchingFamilies[0]?.[1];
}

/** Находит семейство ключа и возвращает его cache-политику. */
export function resolveQueryCachePolicy(queryKey: readonly unknown[]) {
  const family = getQueryFamily(queryKey);

  return {
    persistForMs: family?.persistForMs ?? null,
    staleTimeMs: family?.staleTimeMs ?? queryCacheConfig.defaultStaleTimeMs,
  };
}

/** Проверяет, не истёк ли настроенный срок хранения результата в IndexedDB. */
export function shouldPersistQuery(
  queryKey: readonly unknown[],
  dataUpdatedAt: number,
  now = Date.now(),
): boolean {
  const { persistForMs } = resolveQueryCachePolicy(queryKey);

  return (
    persistForMs !== null &&
    dataUpdatedAt > 0 &&
    dataUpdatedAt <= now &&
    now - dataUpdatedAt < persistForMs
  );
}
