import { DEFAULT_QUERY_META } from "../consts";
import type { QueryClientMeta, ErrorHandlerParams } from "../types";

import {
  isNetworkError,
  isUnauthorizedError,
  isGraphQLClientError,
} from "./apiError";

/**
 * Обработчик ошибок вызванных в `throwOnError` у `useQuery` хуков. Логика работы:
 *
 * - Throws errors for queries marked as `required`.
 * - Throws unauthorized responses and unexpected non-network errors.
 *
 * @param params - Объект с параметрами.
 * @param params.meta - Метаинформация запроса.
 * @param params.error - Объект ошибки.
 * @returns {boolean}
 */
export function queryThrowOnErrorHandler({
  error,
  meta = DEFAULT_QUERY_META,
}: ErrorHandlerParams): boolean {
  const { required } = meta as QueryClientMeta;

  if (
    required ||
    isUnauthorizedError(error) ||
    (!isNetworkError(error) && !isGraphQLClientError(error))
  ) {
    return true;
  }

  return false;
}
