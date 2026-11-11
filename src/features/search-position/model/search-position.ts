import { hashKey } from "@tanstack/react-query";

import type { MediaFiltersState } from "@/entities/filters";
import type { MediaContentMode, MediaSearchParameters } from "@/entities/media";

export const SEARCH_POSITION_RESTORE_STATE_KEY = "restoreSearchPosition";
export const SEARCH_POSITION_RESUME_STATE_KEY = "searchPositionResume";
export const SEARCH_POSITION_CHANGE_EVENT = "search-position:change";

export type SearchPosition = {
  version: 1;
  lastPage: number;
  lastAnime: number;
  filters: MediaFiltersState;
  contentMode: MediaContentMode;
  parameters: MediaSearchParameters;
};

export type SearchPositionAnchor = Pick<
  SearchPosition,
  "lastPage" | "lastAnime"
>;

export type SearchPositionDraft = Omit<
  SearchPosition,
  "version" | "lastPage" | "lastAnime"
>;

export function createSearchPosition(
  draft: SearchPositionDraft,
  anchor: SearchPositionAnchor,
): SearchPosition {
  return { ...draft, ...anchor, version: 1 };
}

export function areSearchPositionsEqual(
  first: SearchPosition,
  second: SearchPosition,
): boolean {
  return hashKey([first]) === hashKey([second]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isYearRange(value: unknown): boolean {
  if (value === null) return true;
  if (!isRecord(value)) return false;
  return [value.fromYear, value.toYear].every(
    (year) =>
      year === null || (typeof year === "number" && Number.isInteger(year)),
  );
}

function isSearchPosition(
  value: unknown,
  mode: MediaContentMode,
): value is SearchPosition {
  if (
    !isRecord(value) ||
    !isRecord(value.filters) ||
    !isRecord(value.parameters)
  )
    return false;
  const { filters, parameters } = value;
  const validSelectionModes = ["include", "exclude"];
  const validMediaSorts = [
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
  const validSearchSorts = [
    "title",
    "trending",
    "popularity",
    "releaseDate",
    "averageScore",
  ];
  return (
    value.version === 1 &&
    value.contentMode === mode &&
    Number.isSafeInteger(value.lastAnime) &&
    Number(value.lastAnime) > 0 &&
    Number.isSafeInteger(value.lastPage) &&
    Number(value.lastPage) > 0 &&
    typeof filters.favoriteOnly === "boolean" &&
    [
      filters.tags,
      filters.genres,
      filters.formats,
      filters.sources,
      filters.statuses,
    ].every(isStringArray) &&
    validMediaSorts.includes(String(filters.sort)) &&
    [
      filters.statusMode,
      filters.formatMode,
      filters.sourceMode,
      filters.genresMode,
      filters.tagsMode,
    ].every(
      (item) =>
        item === undefined || validSelectionModes.includes(String(item)),
    ) &&
    isYearRange(filters.yearRange) &&
    typeof parameters.search === "string" &&
    Number.isSafeInteger(parameters.page) &&
    Number(parameters.page) > 0 &&
    Number.isSafeInteger(parameters.perPage) &&
    Number(parameters.perPage) > 0 &&
    Array.isArray(parameters.tags) &&
    Array.isArray(parameters.genres) &&
    Array.isArray(parameters.formats) &&
    Array.isArray(parameters.sources) &&
    Array.isArray(parameters.statuses) &&
    [
      parameters.tags,
      parameters.genres,
      parameters.formats,
      parameters.sources,
      parameters.statuses,
    ].every(isStringArray) &&
    validSearchSorts.includes(String(parameters.sort)) &&
    [parameters.genresMode, parameters.tagsMode].every(
      (item) =>
        item === undefined || validSelectionModes.includes(String(item)),
    ) &&
    parameters.contentMode === mode &&
    [
      parameters.formatFilterEnabled,
      parameters.sourceFilterEnabled,
      parameters.statusFilterEnabled,
    ].every((item) => typeof item === "boolean") &&
    (parameters.yearRange === undefined || isYearRange(parameters.yearRange))
  );
}

export function searchPositionStorageKey(
  userId: string | undefined,
  mode: MediaContentMode,
) {
  return `search-position:v1:${userId ?? "anonymous"}:${mode}`;
}

export function readSearchPosition(
  key: string,
  mode: MediaContentMode,
): null | SearchPosition {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!isSearchPosition(value, mode)) return null;
    return {
      ...value,
      filters: {
        ...value.filters,
        tagsMode: value.filters.tagsMode ?? "include",
        genresMode: value.filters.genresMode ?? "include",
      },
      parameters: {
        ...value.parameters,
        tagsMode: value.parameters.tagsMode ?? "include",
        genresMode: value.parameters.genresMode ?? "include",
      },
    };
  } catch {
    return null;
  }
}

export function saveSearchPosition(
  key: string,
  position: SearchPosition,
): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(position));
    window.dispatchEvent(new Event(SEARCH_POSITION_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function clearSearchPosition(key: string): boolean {
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new Event(SEARCH_POSITION_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}
