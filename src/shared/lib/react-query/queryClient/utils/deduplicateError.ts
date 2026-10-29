import type { Query } from "@tanstack/react-query";

import { ERROR_TTL } from "../consts";

import {
  isNetworkError,
  isUnauthorizedError,
  isGraphQLClientError,
} from "./apiError";

const errorTimestamps = new Map<string, number>();

function isRecent(key: string) {
  const now = Date.now();
  const last = errorTimestamps.get(key) || 0;
  return now - last < ERROR_TTL;
}

function markAsSeen(key: string) {
  const now = Date.now();

  for (const [seenKey, timestamp] of errorTimestamps) {
    if (now - timestamp >= ERROR_TTL) errorTimestamps.delete(seenKey);
  }

  errorTimestamps.set(key, now);
}

function shouldDeduplicate(key: string) {
  if (isRecent(key)) {
    return true;
  }
  markAsSeen(key);
  return false;
}

/**
 * Deduplicates identical network errors across queries and GraphQL errors by
 * HTTP status, message, and query key.
 *
 * Предотвращает повторную обработку однотипных ошибок в течение заданного времени (`ERROR_TTL`),
 * чтобы избежать множественных уведомлений или обработок одинаковых ошибок.
 *
 * @param error - Error to check.
 * @param [queryKey] - Ключ запроса, связанный с ошибкой (опционально).
 * @returns `true` when this error has already been handled recently.
 *
 * @example
 * const shouldIgnore = deduplicateError(error, queryKey);
 */
export function deduplicateError(
  error: Error,
  queryKey?: Query["queryKey"],
): boolean {
  if (isNetworkError(error)) {
    return shouldDeduplicate(`network_${error.message}`);
  }

  if (!isGraphQLClientError(error)) return false;

  if (isUnauthorizedError(error)) {
    const key = "unauthorized";
    return shouldDeduplicate(key);
  }

  const message = error.response.errors?.[0]?.message;
  const key = `graphql_${error.response.status}_${message ?? "unknown"}_${JSON.stringify(queryKey)}`;
  return shouldDeduplicate(key);
}
