import { useRef, useState, useEffect, useLayoutEffect } from "react";

import { createWatchPageExitSubscription } from "./watch-page-exit";

export function useWatchPageExit(onExit: () => void) {
  const callback = useRef(onExit);
  useLayoutEffect(() => {
    callback.current = onExit;
  });
  const [subscribe] = useState(() =>
    createWatchPageExitSubscription(() => callback.current()),
  );
  useEffect(() => subscribe(window), [subscribe]);
}
