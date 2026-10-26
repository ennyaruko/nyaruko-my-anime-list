import type {
  Query,
  QueryMeta,
  MutationMeta,
  DefaultOptions,
} from "@tanstack/react-query";

import { NotificationVariant } from "../../../ui";

type ErrorNotifier<T> = (err: T) => void | null | {
  /** Сообщение, которое будет выведено в нотификацию. */
  message: string;
  /** Тип нотификации. */
  type: NotificationVariant;
  /**
   *  Функция, в которой можно определить условия вывода нотификации для определенных типов ошибок.
   *
   * - Если не передана, `message` будет выведен для любых ошибок.
   *
   * - Если возвращает `true` - `message` будет выведен.
   *
   * - Если возвращает `false` - будет выведена нотификация по умолчанию.
   */
  validate?: (err: T) => boolean;
  /**
   * Если функция возвращает `null` - уведомление не показывается.
   */
};

export type QueryClientMeta = {
  /**
   * Определяет, является ли запрос обязательным.
   *
   * Если да, то будет выброшена ошибка - `throwOnError: true`, иначе будет вызвана нотификация.
   *
   * @default false
   */
  required?: boolean;
  /**
   * Позволяет переопределить поведение нотификации ошибок.
   *
   * Если не передано, то будет использована нотификация по умолчанию.
   */
  errorNotifier?: ErrorNotifier<Error>;
};

export type ErrorHandlerParams = {
  error: Error;
  queryKey?: Query["queryKey"];
  meta?: QueryMeta | MutationMeta;
};

export type HandleErrorNotifierParams = {
  error: Error;
  queryKey?: Query["queryKey"];
  errorNotifier: ErrorNotifier<Error>;
};

export type DefaultErrorHandlerParams = {
  error: Error;
  queryKey?: Query["queryKey"];
};

export type GetQueryClientParams = {
  defaultOptions?: DefaultOptions;
};

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: QueryClientMeta;
  }
}
