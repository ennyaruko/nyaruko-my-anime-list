import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import type { SearchPosition } from "./search-position";
import { SEARCH_POSITION_RESTORE_STATE_KEY } from "./search-position";

export type UseSearchPositionQuickRestoreOptions = {
  isLoaded: boolean;
  savedPosition: null | SearchPosition;
  onRestore: (position: SearchPosition) => void;
};

export function useSearchPositionQuickRestore({
  isLoaded,
  onRestore,
  savedPosition,
}: UseSearchPositionQuickRestoreOptions) {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldRestore =
    (location.state as null | Record<string, unknown>)?.[
      SEARCH_POSITION_RESTORE_STATE_KEY
    ] === true;

  useEffect(() => {
    if (!shouldRestore || !isLoaded) return;

    if (savedPosition) {
      onRestore(savedPosition);
      return;
    }

    navigate(`${location.pathname}${location.search}${location.hash}`, {
      state: null,
      replace: true,
      preventScrollReset: true,
    });
  }, [
    isLoaded,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    onRestore,
    savedPosition,
    shouldRestore,
  ]);
}
