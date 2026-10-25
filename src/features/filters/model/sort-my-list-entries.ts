import type { MyListEntry } from "@/entities/media";
import type { MediaSortKey } from "@/entities/filters";

function getDateSortValue(date: MyListEntry["startedAt"]): null | number {
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

/** Applies the selected sort mode to a user's media list. */
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
          getDateSortValue(first.startedAt),
          getDateSortValue(second.startedAt),
        );
      case "completedDate":
        return compareNullableNumbers(
          getDateSortValue(first.completedAt),
          getDateSortValue(second.completedAt),
        );
      case "releaseDate":
        return compareNullableNumbers(
          getDateSortValue(first.startDate),
          getDateSortValue(second.startDate),
        );
      case "averageScore":
        return compareNullableNumbers(first.averageScore, second.averageScore);
      case "popularity":
        return compareNullableNumbers(first.popularity, second.popularity);
    }
  });
}
