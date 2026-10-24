import type { FilterOptions } from "@/entities/filters";

import { FilterOptionsDocument } from "./queries";
import { createAniListGraphQLClient } from "./client";

export async function getAniListFilterOptions(
  signal?: AbortSignal,
): Promise<FilterOptions> {
  const client = createAniListGraphQLClient();
  const data = await client.request({
    signal,
    variables: {},
    document: FilterOptionsDocument,
  });

  return {
    genres: (data.genres ?? [])
      .filter((value): value is string => Boolean(value))
      .map((value) => ({ value, label: value })),
    tags: (data.tags ?? [])
      .filter((tag): tag is NonNullable<typeof tag> => tag !== null)
      .map((tag) => ({ value: tag.name, label: tag.name })),
  };
}
