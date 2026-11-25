import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect, useCallback } from "react";

import { showNotification } from "@/shared/ui";

const SCREEN_ROTATION_STORAGE_KEY = "screen-auto-rotation";

type ScreenOrientationController = {
  lock: (orientation: "any" | "portrait") => Promise<void>;
};

function getScreenOrientationController(): null | ScreenOrientationController {
  if (typeof window === "undefined") return null;

  const orientation = window.screen
    .orientation as unknown as Partial<ScreenOrientationController>;
  if (typeof orientation.lock !== "function") {
    return null;
  }

  return orientation as ScreenOrientationController;
}

function isScreenOrientationSupported() {
  if (typeof window === "undefined") return false;

  const isFullscreenContext =
    document.fullscreenElement !== null ||
    window.matchMedia("(display-mode: fullscreen)").matches;

  return (
    isFullscreenContext &&
    window.matchMedia("(pointer: coarse)").matches &&
    getScreenOrientationController() !== null
  );
}

function getInitialAutoRotation() {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(SCREEN_ROTATION_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

export function useScreenRotation() {
  const { t } = useTranslation(["common"]);
  const [autoRotation, setAutoRotationState] = useState(getInitialAutoRotation);
  const [isSupported, setIsSupported] = useState(isScreenOrientationSupported);
  const lastAppliedAutoRotation = useRef(autoRotation);

  useEffect(() => {
    if (!isSupported) return;

    const orientation = getScreenOrientationController();
    if (!orientation) {
      setIsSupported(false);
      return;
    }

    let isCurrentRequest = true;
    const shouldPersist = autoRotation !== lastAppliedAutoRotation.current;

    void orientation
      .lock(autoRotation ? "any" : "portrait")
      .then(() => {
        if (!isCurrentRequest) return;
        if (!shouldPersist) return;

        lastAppliedAutoRotation.current = autoRotation;
        try {
          window.localStorage.setItem(
            SCREEN_ROTATION_STORAGE_KEY,
            String(autoRotation),
          );
        } catch {
          // Keep the in-memory setting when browser storage is unavailable.
        }
      })
      .catch(() => {
        if (!isCurrentRequest) return;

        setAutoRotationState(lastAppliedAutoRotation.current);
        setIsSupported(false);
        showNotification(
          t("common:notify.screenRotationChangeFailed"),
          "error",
        );
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [autoRotation, isSupported, t]);

  const setAutoRotation = useCallback(
    (enabled: boolean) => setAutoRotationState(enabled),
    [],
  );

  return { isSupported, autoRotation, setAutoRotation };
}
