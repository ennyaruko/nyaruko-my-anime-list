import { useSearchParams } from "react-router";
import { useMemo, useState, useEffect, useCallback } from "react";

import type { MediaFiltersState } from "@/entities/filters";

const SEARCH_DEBOUNCE_MS = 250;

/** Keeps the search route's URL parameters and their UI state in sync. */
export function useSearchPageParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") ?? "";
  const genresKey = JSON.stringify(searchParams.getAll("genre"));
  const tagsKey = JSON.stringify(searchParams.getAll("tag"));
  const initialFilters = useMemo<Partial<MediaFiltersState>>(() => {
    const genres = JSON.parse(genresKey) as string[];
    const tags = JSON.parse(tagsKey) as string[];

    return {
      ...(genres.length > 0 ? { genres } : {}),
      ...(tags.length > 0 ? { tags } : {}),
    };
  }, [genresKey, tagsKey]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearchTerm(searchTerm.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const updateSearchTerm = useCallback(
    (value: string) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value) next.set("search", value);
          else next.delete("search");
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const clearInitialFilters = useCallback(() => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("genre");
        next.delete("tag");
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }, [setSearchParams]);

  const restoreSearchTerm = useCallback(
    (value: string) => {
      setDebouncedSearchTerm(value.trim());
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value) next.set("search", value);
          else next.delete("search");
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  return {
    searchTerm,
    initialFilters,
    updateSearchTerm,
    restoreSearchTerm,
    debouncedSearchTerm,
    clearInitialFilters,
  };
}
