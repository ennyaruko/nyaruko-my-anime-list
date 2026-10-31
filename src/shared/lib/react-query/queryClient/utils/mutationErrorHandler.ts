import { DEFAULT_QUERY_META } from "../consts";
import type { QueryClientMeta, ErrorHandlerParams } from "../types";

import { defaultErrorHandler } from "./defaultErrorHandler";
import { handleErrorNotifier } from "./handleErrorNotifier";

/**
 * Обработчик ошибок `useMutation` хуков.
 *
 * @param params - Объект с параметрами
 * @param params.error - Объект ошибки, которая произошла
 * @param params.notify - Объект с функциями для вывода нотификаций.
 */
export function mutationErrorHandler({
  error,
  meta = DEFAULT_QUERY_META,
}: ErrorHandlerParams) {
  const { errorNotifier } = meta as QueryClientMeta;

  if (errorNotifier) {
    return handleErrorNotifier({ error, errorNotifier });
  }

  return defaultErrorHandler({ error });
}
