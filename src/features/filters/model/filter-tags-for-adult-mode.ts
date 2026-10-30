import type { FilterOptions } from "@/entities/filters";

/** Drops persisted tags that are not available in the current site mode. */
export function filterTagsForAdultMode(
  tags: readonly string[],
  options: undefined | FilterOptions,
  isAdultMode: boolean,
): string[] {
  if (!options) return isAdultMode ? [...tags] : [];

  const availableTags = new Set(
    options.tags
      .filter((tag) => isAdultMode || tag.isAdult === false)
      .map(({ value }) => value),
  );

  return tags.filter((tag) => availableTags.has(tag));
}
