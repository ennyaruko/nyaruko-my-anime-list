import { useLocation } from "react-router";
import { useRef, useState, useEffect, useCallback } from "react";

import type { MyListStatus } from "@/entities/media";

const MAX_SAVED_STATUSES = 40;
const statusesByLocation = new Map<string, MyListStatus>();

function saveStatus(locationKey: string, status: MyListStatus) {
  statusesByLocation.delete(locationKey);
  statusesByLocation.set(locationKey, status);

  if (statusesByLocation.size > MAX_SAVED_STATUSES) {
    const oldestLocationKey = statusesByLocation.keys().next().value;
    if (oldestLocationKey) statusesByLocation.delete(oldestLocationKey);
  }
}

export function useMyListStatus() {
  const { pathname, key: locationKey } = useLocation();
  const previousRoute = useRef({ pathname, locationKey });
  const [savedSelection, setSavedSelection] = useState(() => ({
    locationKey,
    status: statusesByLocation.get(locationKey) ?? "PLANNING",
  }));

  const previousStatus =
    previousRoute.current.pathname === pathname
      ? statusesByLocation.get(previousRoute.current.locationKey)
      : undefined;
  const selectedStatus =
    savedSelection.locationKey === locationKey
      ? savedSelection.status
      : (statusesByLocation.get(locationKey) ?? previousStatus ?? "PLANNING");

  useEffect(() => {
    const previous = previousRoute.current;
    if (
      previous.pathname === pathname &&
      previous.locationKey !== locationKey
    ) {
      const status = statusesByLocation.get(previous.locationKey);
      if (status && !statusesByLocation.has(locationKey)) {
        saveStatus(locationKey, status);
        setSavedSelection({ status, locationKey });
      }
    }
    previousRoute.current = { pathname, locationKey };
  }, [locationKey, pathname]);

  const selectStatus = useCallback(
    (status: MyListStatus) => {
      saveStatus(locationKey, status);
      setSavedSelection({ status, locationKey });
    },
    [locationKey],
  );

  return { selectStatus, selectedStatus };
}
