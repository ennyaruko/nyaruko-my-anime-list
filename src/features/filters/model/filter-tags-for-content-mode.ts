import type { FilterOptions } from "@/entities/filters";
import { isAdultContentMode, type MediaContentMode } from "@/entities/media";

/** Drops persisted tags that are not available in the current site mode. */
export function filterTagsForContentMode(
  tags: readonly string[],
  options: undefined | FilterOptions,
  contentMode: MediaContentMode,
): string[] {
  const includeAdultTags = isAdultContentMode(contentMode);
  if (!options) return includeAdultTags ? [...tags] : [];

  const availableTags = new Set(
    options.tags
      .filter((tag) => includeAdultTags || tag.isAdult === false)
      .map(({ value }) => value),
  );

  return tags.filter((tag) => availableTags.has(tag));
}
