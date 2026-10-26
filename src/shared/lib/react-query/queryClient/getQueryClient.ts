import { QueryCache, QueryClient, MutationCache } from "@tanstack/react-query";

import { DEFAULT_QUERY_META } from "./consts";
import type { GetQueryClientParams } from "./types";
import { queryOnErrorHandler } from "./utils/queryOnErrorHandler";
import { mutationErrorHandler } from "./utils/mutationErrorHandler";
import { queryThrowOnErrorHandler } from "./utils/queryThrowOnErrorHandler";

export function getQueryClient({ defaultOptions }: GetQueryClientParams = {}) {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, _, __, mutation) => {
        mutationErrorHandler({ error, meta: mutation.meta });
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        queryOnErrorHandler({
          error,
          meta: query.meta,
          queryKey: query.queryKey,
        });
      },
    }),
    defaultOptions: {
      ...defaultOptions,
      mutations: {
        ...defaultOptions?.mutations,
        meta: DEFAULT_QUERY_META,
      },
      queries: {
        ...defaultOptions?.queries,
        meta: DEFAULT_QUERY_META,
        throwOnError: (error, query) => {
          return queryThrowOnErrorHandler({ error, meta: query.meta });
        },
      },
    },
  });
}
