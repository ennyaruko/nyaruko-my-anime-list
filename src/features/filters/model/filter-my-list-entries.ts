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
  mode: "include" | "exclude",
): boolean {
  if (selected.length === 0) return true;
  const matchesSelected = values.some((value) => selected.includes(value));
  return mode === "include" ? matchesSelected : !matchesSelected;
}

function matchesYearRange(
  year: null | number,
  range: MediaFiltersState["yearRange"],
): boolean {
  if (!range) return true;
  if (year === null) return false;
  return (
    (range.fromYear === null || year >= range.fromYear) &&
    (range.toYear === null || year <= range.toYear)
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
      (!filters.favoriteOnly || entry.isFavorite) &&
      matchesAnySelection(entry.genres, filters.genres, filters.genresMode) &&
      matchesAnySelection(entry.tags, filters.tags, filters.tagsMode) &&
      matchesYearRange(entry.startDate?.year ?? null, filters.yearRange) &&
      matchesFacet(entry.format, filters.formats, filters.formatMode) &&
      matchesFacet(entry.source, filters.sources, filters.sourceMode) &&
      matchesFacet(entry.releaseStatus, filters.statuses, filters.statusMode),
  );

  return sortMyListEntries(matchingEntries, filters.sort);
}
