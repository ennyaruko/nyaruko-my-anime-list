import type { MyListEntry } from "@/entities/my-list";
import type { MediaSortKey } from "@/entities/filters";

function dateSortValue(
  date: null | {
    day: null | number;
    year: null | number;
    month: null | number;
  },
): null | number {
  if (!date || date.year === null) return null;
  return date.year * 10_000 + (date.month ?? 0) * 100 + (date.day ?? 0);
}

function compareNullableNumbers(
  first: null | number,
  second: null | number,
  descending = true,
): number {
  if (first === null && second === null) return 0;
  if (first === null) return 1;
  if (second === null) return -1;
  return descending ? second - first : first - second;
}

/** Applies the selected sort mode to entries in a user's media list. */
export function sortMyListEntries(
  entries: MyListEntry[],
  sort: MediaSortKey,
): MyListEntry[] {
  return [...entries].sort((first, second) => {
    switch (sort) {
      case "title":
        return first.title.localeCompare(second.title);
      case "score":
        return compareNullableNumbers(first.score, second.score);
      case "progress":
        return compareNullableNumbers(first.progress, second.progress);
      case "lastUpdated":
        return compareNullableNumbers(first.updatedAt, second.updatedAt);
      case "lastAdded":
        return compareNullableNumbers(first.createdAt, second.createdAt);
      case "startDate":
        return compareNullableNumbers(
          dateSortValue(first.startedAt),
          dateSortValue(second.startedAt),
        );
      case "completedDate":
        return compareNullableNumbers(
          dateSortValue(first.completedAt),
          dateSortValue(second.completedAt),
        );
      case "releaseDate":
        return compareNullableNumbers(
          dateSortValue(first.startDate),
          dateSortValue(second.startDate),
        );
      case "averageScore":
        return compareNullableNumbers(first.averageScore, second.averageScore);
      case "popularity":
        return compareNullableNumbers(first.popularity, second.popularity);
    }
  });
}
