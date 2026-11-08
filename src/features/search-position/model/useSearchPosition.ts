import { useState, useEffect, useCallback } from "react";

import type { MediaContentMode } from "@/entities/media";

import type { SearchPosition } from "./search-position";
import {
  readSearchPosition,
  saveSearchPosition,
  clearSearchPosition,
  searchPositionStorageKey,
  SEARCH_POSITION_CHANGE_EVENT,
} from "./search-position";

export type UseSearchPositionOptions = {
  userId?: string;
  contentMode: MediaContentMode;
};

export type UseSearchPositionResult = {
  isLoaded: boolean;
  clearPosition: () => boolean;
  savedPosition: null | SearchPosition;
  savePosition: (position: SearchPosition) => boolean;
};

export function useSearchPosition({
  userId,
  contentMode,
}: UseSearchPositionOptions): UseSearchPositionResult {
  const storageKey = searchPositionStorageKey(userId, contentMode);
  const [savedPosition, setSavedPosition] = useState<null | SearchPosition>(
    null,
  );
  const [loadedStorageKey, setLoadedStorageKey] = useState<null | string>(null);

  useEffect(() => {
    const refreshPosition = () =>
      setSavedPosition(readSearchPosition(storageKey, contentMode));

    refreshPosition();
    setLoadedStorageKey(storageKey);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === storageKey) refreshPosition();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(SEARCH_POSITION_CHANGE_EVENT, refreshPosition);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(SEARCH_POSITION_CHANGE_EVENT, refreshPosition);
    };
  }, [contentMode, storageKey]);

  const savePosition = useCallback(
    (position: SearchPosition) => {
      if (!saveSearchPosition(storageKey, position)) return false;
      setSavedPosition(position);
      return true;
    },
    [storageKey],
  );

  const clearPosition = useCallback(() => {
    if (!clearSearchPosition(storageKey)) return false;
    setSavedPosition(null);
    return true;
  }, [storageKey]);

  return {
    savePosition,
    clearPosition,
    savedPosition,
    isLoaded: loadedStorageKey === storageKey,
  };
}
