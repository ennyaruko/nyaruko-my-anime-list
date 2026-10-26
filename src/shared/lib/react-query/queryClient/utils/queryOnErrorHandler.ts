import { DEFAULT_QUERY_META } from "../consts";
import type { QueryClientMeta, ErrorHandlerParams } from "../types";

import { handleErrorNotifier } from "./handleErrorNotifier";
import { defaultErrorHandler } from "./defaultErrorHandler";
import {
  isNetworkError,
  isUnauthorizedError,
  isGraphQLClientError,
} from "./apiError";

/**
 * Обработчик ошибок вызванных в `onError` у `useQuery` хуков. Логика работы:
 *
 * - Required queries and unauthorized responses are delegated to `throwOnError`.
 * - Network failures and GraphQL errors are notified; unexpected errors are delegated to `throwOnError`.
 *
 * @param params - Объект с параметрами.
 * @param params.meta - Метаинформация запроса.
 * @param params.error - Объект ошибки.
 */
export function queryOnErrorHandler({
  error,
  queryKey,
  meta = DEFAULT_QUERY_META,
}: ErrorHandlerParams) {
  const { required, errorNotifier } = meta as QueryClientMeta;

  if (
    required ||
    isUnauthorizedError(error) ||
    (!isGraphQLClientError(error) && !isNetworkError(error))
  )
    return;

  if (errorNotifier) {
    return handleErrorNotifier({ error, queryKey, errorNotifier });
  }

  return defaultErrorHandler({ error, queryKey });
}
