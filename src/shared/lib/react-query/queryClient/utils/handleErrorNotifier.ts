import { showNotification } from "@/shared/ui";

import { DEFAULT_ERROR_MESSAGE } from "../consts";
import type { HandleErrorNotifierParams } from "../types";

import { defaultErrorHandler } from "./defaultErrorHandler";

/**
 * Выполняет пользовательскую функцию уведомления об ошибках и вызывает `notifyError`
 * with the configured message.
 *
 * @param params - Объект с параметрами
 * @param params.errorNotifier - Returns notification configuration, or `null` to suppress it.
 * @param params.error - Error that occurred.
 */
export function handleErrorNotifier({
  error,
  queryKey,
  errorNotifier,
}: HandleErrorNotifierParams) {
  const result = errorNotifier(error);

  // Подавить уведомление если result === null
  if (result === null) return;

  if (typeof result === "object" && "message" in result) {
    if (!result.validate) {
      return showNotification(
        result.message || DEFAULT_ERROR_MESSAGE,
        result.type,
      );
    } else if (result.validate(error)) {
      return showNotification(
        result.message || DEFAULT_ERROR_MESSAGE,
        result.type,
      );
    } else {
      return defaultErrorHandler({ error, queryKey });
    }
  }
  return defaultErrorHandler({ error, queryKey });
}
