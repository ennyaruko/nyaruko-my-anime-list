import { useLocation } from "react-router";
import { useMemo, useState, useEffect, useCallback } from "react";

import type { MediaContentMode } from "@/entities/media";
import type { MediaFiltersState } from "@/entities/filters";

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
  yearRange: null,
  sort: "releaseDate",
  favoriteOnly: false,
  tagsMode: "include",
  statusMode: "include",
  formatMode: "include",
  sourceMode: "include",
  genresMode: "include",
};
const EMPTY_INITIAL_FILTERS: Partial<MediaFiltersState> = {};
const MAX_FILTER_DRAFTS = 40;
const filterDraftsByRoute = new Map<string, MediaFiltersState>();

export function createMediaFilterDraftKey(
  storageKey: string,
  pathname: string,
  initialFiltersKey: string,
): string {
  return JSON.stringify([storageKey, pathname, initialFiltersKey]);
}

export function resetMediaFilterDrafts(scope: MediaFilterScope) {
  const scopeMarker = `:v2:${scope}:`;

  for (const key of filterDraftsByRoute.keys()) {
    const [storageKey] = JSON.parse(key) as [string];
    if (storageKey.includes(scopeMarker)) filterDraftsByRoute.delete(key);
  }
}

function getFilterDraft(key: string): undefined | MediaFiltersState {
  const draft = filterDraftsByRoute.get(key);
  if (draft) {
    filterDraftsByRoute.delete(key);
    filterDraftsByRoute.set(key, draft);
  }
  return draft;
}

function saveFilterDraft(key: string, filters: MediaFiltersState) {
  filterDraftsByRoute.delete(key);
  filterDraftsByRoute.set(key, filters);

  if (filterDraftsByRoute.size > MAX_FILTER_DRAFTS) {
    const oldestKey = filterDraftsByRoute.keys().next().value;
    if (oldestKey) filterDraftsByRoute.delete(oldestKey);
  }
}

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

function omitSort(filters: MediaFiltersState): Omit<MediaFiltersState, "sort"> {
  return Object.fromEntries(
    Object.entries(filters).filter(([key]) => key !== "sort"),
  ) as Omit<MediaFiltersState, "sort">;
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
      sort: DEFAULT_FILTERS.sort,
      tags: filterStrings(saved.tags),
      genres: filterStrings(saved.genres),
      favoriteOnly: saved.favoriteOnly === true,
      formats: filterValues(saved.formats, allFormatValues),
      sources: filterValues(saved.sources, allSourceValues),
      statuses: filterValues(saved.statuses, allStatusValues),
      tagsMode: saved.tagsMode === "exclude" ? "exclude" : "include",
      statusMode: saved.statusMode === "exclude" ? "exclude" : "include",
      formatMode: saved.formatMode === "exclude" ? "exclude" : "include",
      sourceMode: saved.sourceMode === "exclude" ? "exclude" : "include",
      genresMode: saved.genresMode === "exclude" ? "exclude" : "include",
      yearRange:
        isObject(saved.yearRange) &&
        (saved.yearRange.fromYear === null ||
          typeof saved.yearRange.fromYear === "number") &&
        (saved.yearRange.toYear === null ||
          typeof saved.yearRange.toYear === "number")
          ? {
              toYear: saved.yearRange.toYear as null | number,
              fromYear: saved.yearRange.fromYear as null | number,
            }
          : null,
    };
  } catch {
    return DEFAULT_FILTERS;
  }
}

function getStorageKey(
  scope: MediaFilterScope,
  userId: string | undefined,
  contentMode: MediaContentMode,
): string {
  const modeSuffix =
    contentMode === "hentai"
      ? ":adult"
      : contentMode === "ecchi"
        ? ":ecchi"
        : "";
  return `media-filter-settings:v2:${scope}:${userId ?? "anonymous"}${modeSuffix}`;
}

export function useMediaFilters(
  scope: MediaFilterScope,
  userId?: string,
  contentMode: MediaContentMode = "safe",
  initialFilters: Partial<MediaFiltersState> = EMPTY_INITIAL_FILTERS,
) {
  const { pathname, key: locationKey } = useLocation();
  const storageKey = getStorageKey(scope, userId, contentMode);
  const initialFiltersKey = JSON.stringify(initialFilters);
  const draftKey = createMediaFilterDraftKey(
    storageKey,
    pathname,
    initialFiltersKey,
  );
  const [filters, setFilters] = useState(
    () =>
      getFilterDraft(draftKey) ?? {
        ...readSavedFilters(storageKey),
        ...initialFilters,
      },
  );
  const [savedFilters, setSavedFilters] = useState(() =>
    readSavedFilters(storageKey),
  );

  useEffect(() => {
    const saved = readSavedFilters(storageKey);
    const draft = getFilterDraft(draftKey);
    const nextFilters = draft ?? { ...saved, ...initialFilters };

    if (!draft) saveFilterDraft(draftKey, nextFilters);
    setFilters(nextFilters);
    setSavedFilters(saved);
  }, [draftKey, initialFilters, locationKey, storageKey]);

  const updateFilters = useCallback(
    (updates: Partial<MediaFiltersState>) => {
      setFilters((current) => {
        const next = { ...current, ...updates };
        saveFilterDraft(draftKey, next);
        return next;
      });
    },
    [draftKey],
  );

  const saveFilters = () => {
    const filterValues = omitSort(filters);
    setSavedFilters({ ...filterValues, sort: savedFilters.sort });
    saveFilterDraft(draftKey, filters);
    try {
      localStorage.setItem(storageKey, JSON.stringify(filterValues));
    } catch {
      // Storage can be unavailable or full.
    }
  };

  const resetFilters = () => {
    setFilters((current) => {
      const next = { ...savedFilters, sort: current.sort };
      saveFilterDraft(draftKey, next);
      return next;
    });
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
    hasUnsavedChanges: !areValuesEqual(
      omitSort(filters),
      omitSort(savedFilters),
    ),
  };
}
