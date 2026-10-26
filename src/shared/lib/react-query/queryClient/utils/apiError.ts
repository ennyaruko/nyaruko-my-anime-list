import { ClientError } from "graphql-request";

export function isGraphQLClientError(error: unknown): error is ClientError {
  return error instanceof ClientError;
}

/** Fetch rejects with TypeError for transport failures such as blocked requests. */
export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

export function isUnauthorizedError(error: unknown): boolean {
  return isGraphQLClientError(error) && error.response.status === 401;
}

export function getErrorMessage(error: Error): string | undefined {
  if (isGraphQLClientError(error)) {
    const message = error.response.errors
      ?.map(({ message: errorMessage }) => errorMessage)
      .filter(Boolean)
      .join("\n");

    return message || undefined;
  }

  return error.message.trim() || undefined;
}
