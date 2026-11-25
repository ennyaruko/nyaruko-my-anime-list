import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect, useCallback } from "react";

import { showNotification } from "@/shared/ui";

const SCREEN_ROTATION_STORAGE_KEY = "screen-auto-rotation";

type ScreenOrientationController = {
  unlock: () => void;
  lock: (orientation: "portrait") => Promise<void>;
};

function getScreenOrientationController(): null | ScreenOrientationController {
  if (typeof window === "undefined") return null;

  const orientation = window.screen
    .orientation as unknown as Partial<ScreenOrientationController>;
  if (
    typeof orientation.lock !== "function" ||
    typeof orientation.unlock !== "function"
  ) {
    return null;
  }

  return orientation as ScreenOrientationController;
}

function isScreenOrientationSupported() {
  if (typeof window === "undefined") return false;

  const isInstalledApp =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    ("standalone" in window.navigator && window.navigator.standalone === true);

  return (
    isInstalledApp &&
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
  const initialAutoRotation = useRef(autoRotation);

  useEffect(() => {
    if (initialAutoRotation.current || !isSupported) return;

    const orientation = getScreenOrientationController();
    if (!orientation) {
      setIsSupported(false);
      return;
    }

    void orientation.lock("portrait").catch(() => setIsSupported(false));
  }, [isSupported]);

  const setAutoRotation = useCallback(
    async (enabled: boolean) => {
      if (!isSupported) return;

      try {
        const orientation = getScreenOrientationController();
        if (!orientation) {
          setIsSupported(false);
          return;
        }

        if (enabled) {
          orientation.unlock();
        } else {
          await orientation.lock("portrait");
        }

        setAutoRotationState(enabled);
        try {
          window.localStorage.setItem(
            SCREEN_ROTATION_STORAGE_KEY,
            String(enabled),
          );
        } catch {
          // Keep the in-memory setting when browser storage is unavailable.
        }
      } catch {
        setIsSupported(false);
        showNotification(
          t("common:notify.screenRotationChangeFailed"),
          "error",
        );
      }
    },
    [isSupported, t],
  );

  return { isSupported, autoRotation, setAutoRotation };
}
