import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";

import { hashKey } from "@tanstack/react-query";

import type { MediaFiltersState } from "@/entities/filters";
import type { MediaSearchParameters } from "@/entities/media";

import type { SearchPosition } from "./search-position";
import {
  SEARCH_POSITION_RESUME_STATE_KEY,
  SEARCH_POSITION_RESTORE_STATE_KEY,
} from "./search-position";

export type UseSearchPositionResumeOptions = {
  parameters: MediaSearchParameters;
  updateFilters: (updates: Partial<MediaFiltersState>) => void;
};

export function useSearchPositionResume({
  parameters,
  updateFilters,
}: UseSearchPositionResumeOptions) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const locationState = location.state as null | Record<string, unknown>;
  const [resume, setResume] = useState<null | SearchPosition>(
    () =>
      (locationState?.[SEARCH_POSITION_RESUME_STATE_KEY] as
        undefined | SearchPosition) ?? null,
  );
  const [restoring, setRestoring] = useState(false);
  const matchesResume =
    resume !== null && hashKey([parameters]) === hashKey([resume.parameters]);
  const activeResume = matchesResume ? resume : null;

  useEffect(() => {
    if (matchesResume) setRestoring(false);
  }, [matchesResume]);

  const restorePosition = useCallback(
    (position: SearchPosition) => {
      setResume(position);
      setRestoring(true);
      updateFilters(position.filters);

      const nextState = { ...locationState };
      delete nextState[SEARCH_POSITION_RESTORE_STATE_KEY];
      nextState[SEARCH_POSITION_RESUME_STATE_KEY] = position;

      const nextSearchParams = new URLSearchParams(location.search);
      if (position.parameters.search) {
        nextSearchParams.set("search", position.parameters.search);
      } else {
        nextSearchParams.delete("search");
      }

      const search = nextSearchParams.toString();
      navigate(
        `${location.pathname}${search ? `?${search}` : ""}${location.hash}`,
        { replace: true, state: nextState, preventScrollReset: true },
      );
    },
    [
      location.hash,
      location.pathname,
      location.search,
      locationState,
      navigate,
      updateFilters,
    ],
  );

  const returnToStart = useCallback(() => {
    setResume(null);
    const nextState = { ...locationState };
    delete nextState[SEARCH_POSITION_RESUME_STATE_KEY];
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      preventScrollReset: true,
      state: Object.keys(nextState).length ? nextState : null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    location.hash,
    location.pathname,
    location.search,
    locationState,
    navigate,
  ]);

  const getInitialIndex = useCallback(
    (animeIds: readonly number[]) => {
      if (!activeResume || navigationType === "POP") return undefined;
      return Math.max(
        0,
        animeIds.findIndex((animeId) => animeId === activeResume.lastAnime),
      );
    },
    [activeResume, navigationType],
  );

  return {
    restoring,
    activeResume,
    matchesResume,
    returnToStart,
    getInitialIndex,
    restorePosition,
  };
}
