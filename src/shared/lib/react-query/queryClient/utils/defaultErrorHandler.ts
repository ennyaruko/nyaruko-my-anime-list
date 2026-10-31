import { showNotification } from "@/shared/ui";

import { DEFAULT_ERROR_MESSAGE } from "../consts";
import type { DefaultErrorHandlerParams } from "../types";

import { getErrorMessage } from "./apiError";
import { deduplicateError } from "./deduplicateError";

/**
 * Notifies with GraphQL response messages when available, otherwise the error message.
 *
 * @param params.error - Error that occurred.
 */
export function defaultErrorHandler({
  error,
  queryKey,
}: DefaultErrorHandlerParams) {
  if (deduplicateError(error, queryKey)) {
    return;
  }

  return showNotification(
    getErrorMessage(error) ?? DEFAULT_ERROR_MESSAGE,
    "error",
  );
}
