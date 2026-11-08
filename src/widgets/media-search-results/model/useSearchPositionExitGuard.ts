import { useRef, useEffect, useCallback } from "react";
import type { To, BlockerFunction } from "react-router";
import {
  useBlocker,
  useNavigate,
  useBeforeUnload,
  useSearchParams,
} from "react-router";

import type { SearchPosition } from "@/features/search-position";
import {
  createSearchPosition,
  areSearchPositionsEqual,
} from "@/features/search-position";

import type { MediaFiltersState } from "@/entities/filters";
import type { MediaContentMode, MediaSearchParameters } from "@/entities/media";

const SEARCH_POSITION_GUARD_PARAM = "search-position-guard";

export type UseSearchPositionExitGuardOptions = {
  baselinePage: number;
  filters: MediaFiltersState;
  furthestVisiblePage: number;
  contentMode: MediaContentMode;
  parameters: MediaSearchParameters;
  savedPosition: null | SearchPosition;
  savePosition: (position: SearchPosition) => boolean;
  captureAnchor: () => null | Pick<SearchPosition, "lastPage" | "lastAnime">;
};

export type UseSearchPositionExitGuardResult = {
  isPromptOpen: boolean;
  handleStay: VoidFunction;
  handleLeave: VoidFunction;
  handleSaveAndLeave: () => boolean;
  blocker: ReturnType<typeof useBlocker>;
};

export function useSearchPositionExitGuard({
  filters,
  parameters,
  contentMode,
  baselinePage,
  savePosition,
  captureAnchor,
  savedPosition,
  furthestVisiblePage,
}: UseSearchPositionExitGuardOptions): UseSearchPositionExitGuardResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const hadGuardParam = useRef(false);
  const pendingDestination = useRef<null | { to: To; state: unknown }>(null);
  const bypassNextNavigation = useRef(false);
  const navigate = useNavigate();
  const hasGuardParam = searchParams.get(SEARCH_POSITION_GUARD_PARAM) === "1";
  const hasUnsavedPosition = useCallback(() => {
    if (furthestVisiblePage <= baselinePage) return false;
    const anchor = captureAnchor();
    if (!anchor) return false;
    const currentPosition = createSearchPosition(
      { filters, parameters, contentMode },
      anchor,
    );
    return (
      !savedPosition || !areSearchPositionsEqual(currentPosition, savedPosition)
    );
  }, [
    captureAnchor,
    baselinePage,
    contentMode,
    filters,
    furthestVisiblePage,
    parameters,
    savedPosition,
  ]);

  const shouldBlockNavigation = useCallback<BlockerFunction>(
    ({ nextLocation, currentLocation }) => {
      if (bypassNextNavigation.current) {
        bypassNextNavigation.current = false;
        return false;
      }

      const shouldBlock =
        currentLocation.pathname !== nextLocation.pathname &&
        hasUnsavedPosition();

      if (shouldBlock) {
        pendingDestination.current = {
          state: nextLocation.state,
          to: {
            hash: nextLocation.hash,
            search: nextLocation.search,
            pathname: nextLocation.pathname,
          },
        };
      }

      return shouldBlock;
    },
    [hasUnsavedPosition],
  );
  const blocker = useBlocker(shouldBlockNavigation);

  useEffect(() => {
    if (blocker.state !== "blocked") {
      hadGuardParam.current = hasGuardParam;
      return;
    }

    if (hasGuardParam) {
      hadGuardParam.current = true;
      return;
    }

    if (hadGuardParam.current) {
      blocker.reset();
      hadGuardParam.current = false;
      return;
    }

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set(SEARCH_POSITION_GUARD_PARAM, "1");
        return next;
      },
      { preventScrollReset: true },
    );
  }, [blocker.reset, blocker.state, hasGuardParam, setSearchParams]);

  useBeforeUnload(
    useCallback(
      (event: BeforeUnloadEvent) => {
        if (!hasUnsavedPosition()) return;
        event.preventDefault();
        event.returnValue = "";
      },
      [hasUnsavedPosition],
    ),
  );

  const navigateToPendingDestination = () => {
    const destination = pendingDestination.current;
    if (!destination) {
      handleStay();
      return;
    }

    pendingDestination.current = null;
    hadGuardParam.current = false;
    if (blocker.state === "blocked") blocker.reset();
    bypassNextNavigation.current = true;
    navigate(destination.to, {
      replace: true,
      state: destination.state,
      preventScrollReset: true,
    });
  };

  const handleLeave = () => {
    navigateToPendingDestination();
  };
  const handleStay = () => {
    pendingDestination.current = null;
    if (blocker.state === "blocked") blocker.reset();
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete(SEARCH_POSITION_GUARD_PARAM);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };
  const handleSaveAndLeave = () => {
    const anchor = captureAnchor();
    if (!anchor) {
      navigateToPendingDestination();
      return true;
    }
    const position = createSearchPosition(
      { filters, parameters, contentMode },
      anchor,
    );
    if (savePosition(position)) {
      navigateToPendingDestination();
      return true;
    }
    return false;
  };

  return {
    blocker,
    handleStay,
    handleLeave,
    handleSaveAndLeave,
    isPromptOpen: hasGuardParam,
  };
}
