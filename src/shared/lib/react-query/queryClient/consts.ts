import type { QueryClientMeta } from "./types";

/** Задержка для дедупликации ошибок в миллисекундах. */
export const ERROR_TTL = 1000;

export const DEFAULT_QUERY_META: QueryClientMeta = {
  required: false,
};

export const DEFAULT_ERROR_MESSAGE = "Unexpected Error";
