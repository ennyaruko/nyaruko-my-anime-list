import { useMemo, useState, useEffect } from "react";

import type { MediaSortKey } from "@/entities/filters";
import type { MyListEntry, MyListStatus } from "@/entities/my-list";

import { sortMyListEntries } from "./sortMyListEntries";

const STORAGE_KEY = "media-filter-selections:v1:my-list";
const DEFAULT_SORT: MediaSortKey = "releaseDate";
const SORT_KEYS: readonly MediaSortKey[] = [
  "releaseDate",
  "popularity",
  "averageScore",
  "score",
  "title",
  "startDate",
  "completedDate",
  "lastUpdated",
  "lastAdded",
  "progress",
];

type SavedFilters = {
  tags: string[];
  genres: string[];
  sort: MediaSortKey;
};

function readSavedFilters(): SavedFilters {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "null",
    );
    if (!saved || typeof saved !== "object") {
      return { tags: [], genres: [], sort: DEFAULT_SORT };
    }

    const values = saved as Record<string, unknown>;
    return {
      sort: SORT_KEYS.includes(values.sort as MediaSortKey)
        ? (values.sort as MediaSortKey)
        : DEFAULT_SORT,
      tags: Array.isArray(values.tags)
        ? values.tags.filter(
            (value): value is string => typeof value === "string",
          )
        : [],
      genres: Array.isArray(values.genres)
        ? values.genres.filter(
            (value): value is string => typeof value === "string",
          )
        : [],
    };
  } catch {
    return { tags: [], genres: [], sort: DEFAULT_SORT };
  }
}

export function useMyListFilters(
  entries: readonly MyListEntry[],
  status: MyListStatus,
) {
  const [filters, setFilters] = useState<SavedFilters>(readSavedFilters);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // Storage can be unavailable or full.
    }
  }, [filters]);

  const filteredEntries = useMemo(() => {
    const selectedGenres = new Set(filters.genres);
    const selectedTags = new Set(filters.tags);
    const matchingEntries = entries.filter(
      (entry) =>
        entry.status === status &&
        (selectedGenres.size === 0 ||
          entry.genres.some((genre) => selectedGenres.has(genre))) &&
        (selectedTags.size === 0 ||
          entry.tags.some((tag) => selectedTags.has(tag))),
    );
    return sortMyListEntries(matchingEntries, filters.sort);
  }, [entries, filters, status]);

  return {
    filteredEntries,
    sort: filters.sort,
    tags: filters.tags,
    genres: filters.genres,
    setTags: (tags: string[]) =>
      setFilters((current) => ({ ...current, tags })),
    setSort: (sort: MediaSortKey) =>
      setFilters((current) => ({ ...current, sort })),
    setGenres: (genres: string[]) =>
      setFilters((current) => ({ ...current, genres })),
  };
}
