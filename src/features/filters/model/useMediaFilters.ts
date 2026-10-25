import { useMemo, useState, useEffect } from "react";

import type { MediaSortKey, MediaFiltersState } from "@/entities/filters";

import {
  allFormatValues,
  allSourceValues,
  allStatusValues,
} from "./media-filter-options";

export type MediaFilterScope = "search" | "my-list";

export type AppliedMediaFilterValues = {
  formats: string[];
  sources: string[];
  statuses: string[];
  formatFilterEnabled: boolean;
  sourceFilterEnabled: boolean;
  statusFilterEnabled: boolean;
};

const DEFAULT_FILTERS: MediaFiltersState = {
  tags: [],
  genres: [],
  formats: [],
  sources: [],
  statuses: [],
  isAdult: false,
  sort: "releaseDate",
  statusMode: "include",
  formatMode: "include",
  sourceMode: "include",
};

const LIST_SORT_KEYS: readonly MediaSortKey[] = [
  "score",
  "title",
  "progress",
  "startDate",
  "lastAdded",
  "popularity",
  "releaseDate",
  "lastUpdated",
  "averageScore",
  "completedDate",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function areValuesEqual(first: unknown, second: unknown): boolean {
  if (Object.is(first, second)) return true;

  if (Array.isArray(first) || Array.isArray(second)) {
    return (
      Array.isArray(first) &&
      Array.isArray(second) &&
      first.length === second.length &&
      first.every((value, index) => areValuesEqual(value, second[index]))
    );
  }

  if (!isObject(first) || !isObject(second)) return false;

  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  return (
    firstKeys.length === secondKeys.length &&
    firstKeys.every(
      (key) =>
        Object.hasOwn(second, key) && areValuesEqual(first[key], second[key]),
    )
  );
}

function filterValues<T extends string>(
  values: unknown,
  allowed: readonly T[],
): T[] {
  if (!Array.isArray(values)) return [];

  return values.filter(
    (value): value is T =>
      typeof value === "string" && allowed.includes(value as T),
  );
}

function filterStrings(values: unknown): string[] {
  return Array.isArray(values)
    ? values.filter((value): value is string => typeof value === "string")
    : [];
}

function applyToAll<T extends string>(
  values: readonly T[],
  mode: "include" | "exclude",
  all: readonly T[],
): T[] {
  return mode === "include" || values.length === 0
    ? [...values]
    : all.filter((value) => !values.includes(value));
}

function readSavedFilters(key: string): MediaFiltersState {
  if (typeof localStorage === "undefined") return DEFAULT_FILTERS;

  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "null") as unknown;
    if (!isObject(saved)) return DEFAULT_FILTERS;

    return {
      ...DEFAULT_FILTERS,
      tags: filterStrings(saved.tags),
      isAdult: saved.isAdult === true,
      genres: filterStrings(saved.genres),
      formats: filterValues(saved.formats, allFormatValues),
      sources: filterValues(saved.sources, allSourceValues),
      statuses: filterValues(saved.statuses, allStatusValues),
      statusMode: saved.statusMode === "exclude" ? "exclude" : "include",
      formatMode: saved.formatMode === "exclude" ? "exclude" : "include",
      sourceMode: saved.sourceMode === "exclude" ? "exclude" : "include",
      sort: LIST_SORT_KEYS.includes(saved.sort as MediaSortKey)
        ? (saved.sort as MediaSortKey)
        : DEFAULT_FILTERS.sort,
    };
  } catch {
    return DEFAULT_FILTERS;
  }
}

function getStorageKey(scope: MediaFilterScope, userId?: string): string {
  return `media-filter-settings:v2:${scope}:${userId ?? "anonymous"}`;
}

export function useMediaFilters(scope: MediaFilterScope, userId?: string) {
  const storageKey = getStorageKey(scope, userId);
  const [filters, setFilters] = useState(() => readSavedFilters(storageKey));
  const [savedFilters, setSavedFilters] = useState(() =>
    readSavedFilters(storageKey),
  );

  useEffect(() => {
    setFilters(readSavedFilters(storageKey));
    setSavedFilters(readSavedFilters(storageKey));
  }, [storageKey]);

  const updateFilters = (updates: Partial<MediaFiltersState>) => {
    setFilters((current) => ({ ...current, ...updates }));
  };

  const saveFilters = () => {
    setSavedFilters(filters);
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters));
    } catch {
      // Storage can be unavailable or full.
    }
  };

  const resetFilters = () => {
    setFilters(savedFilters);
  };

  const appliedValues = useMemo(
    () => ({
      formatFilterEnabled: filters.formats.length > 0,
      sourceFilterEnabled: filters.sources.length > 0,
      statusFilterEnabled: filters.statuses.length > 0,
      formats: applyToAll(filters.formats, filters.formatMode, allFormatValues),
      sources: applyToAll(filters.sources, filters.sourceMode, allSourceValues),
      statuses: applyToAll(
        filters.statuses,
        filters.statusMode,
        allStatusValues,
      ),
    }),
    [filters],
  );

  return {
    filters,
    saveFilters,
    savedFilters,
    resetFilters,
    updateFilters,
    appliedValues,
    hasUnsavedChanges: !areValuesEqual(filters, savedFilters),
  };
}
