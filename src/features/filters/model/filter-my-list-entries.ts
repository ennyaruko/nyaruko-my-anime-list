import type { MediaFiltersState } from "@/entities/filters";
import { isMediaVisibleInContentMode } from "@/entities/media";
import type {
  MyListEntry,
  MyListStatus,
  MediaContentMode,
} from "@/entities/media";

import { sortMyListEntries } from "./sort-my-list-entries";

function matchesFacet(
  value: null | string,
  selected: readonly string[],
  mode: "include" | "exclude",
): boolean {
  if (selected.length === 0) return true;
  if (mode === "include") return value !== null && selected.includes(value);
  return value === null || !selected.includes(value);
}

function matchesAnySelection(
  values: readonly string[],
  selected: readonly string[],
): boolean {
  return (
    selected.length === 0 || values.some((value) => selected.includes(value))
  );
}

/** Applies the user's saved and temporary filters to one list status. */
export function filterMyListEntries(
  entries: readonly MyListEntry[],
  status: MyListStatus,
  filters: MediaFiltersState,
  contentMode: MediaContentMode,
): MyListEntry[] {
  const matchingEntries = entries.filter(
    (entry) =>
      entry.status === status &&
      isMediaVisibleInContentMode(entry, contentMode) &&
      matchesAnySelection(entry.genres, filters.genres) &&
      matchesAnySelection(entry.tags, filters.tags) &&
      matchesFacet(entry.format, filters.formats, filters.formatMode) &&
      matchesFacet(entry.source, filters.sources, filters.sourceMode) &&
      matchesFacet(entry.releaseStatus, filters.statuses, filters.statusMode),
  );

  return sortMyListEntries(matchingEntries, filters.sort);
}
