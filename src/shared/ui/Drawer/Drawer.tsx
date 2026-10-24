import { createPortal } from "react-dom";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
} from "react";

import clsx from "clsx";

import { DrawerContext } from "./DrawerContext";

import * as styles from "./Drawer.css";

type DrawerSide = "left" | "right";

export type DrawerProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onClose" | "children"
> & {
  open: boolean;
  side?: DrawerSide;
  children: ReactNode;
  fullScreen?: boolean;
  onClose: VoidFunction;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
};

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex >= 0 &&
      getComputedStyle(element).visibility !== "hidden",
  );
}

let bodyScrollLockCount = 0;
let previousBodyOverflow: null | string = null;

function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    if (bodyScrollLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    bodyScrollLockCount += 1;
    return () => {
      bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
      if (bodyScrollLockCount === 0) {
        document.body.style.overflow = previousBodyOverflow ?? "";
        previousBodyOverflow = null;
      }
    };
  }, [enabled]);
}

export function Drawer({
  open,
  onClose,
  children,
  className,
  side = "right",
  fullScreen = false,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  ...props
}: DrawerProps) {
  const [portalRoot, setPortalRoot] = useState<null | HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);
  const closeOnEscapeRef = useRef(closeOnEscape);

  useEffect(() => setPortalRoot(document.body), []);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    closeOnEscapeRef.current = closeOnEscape;
  }, [closeOnEscape]);

  const close = useCallback(() => {
    if (openRef.current) onCloseRef.current();
  }, []);

  useBodyScrollLock(open && portalRoot !== null);

  useEffect(() => {
    panelRef.current?.toggleAttribute("inert", !open);
  }, [open, portalRoot]);

  useEffect(() => {
    if (!open || !portalRoot) return;
    const panel = panelRef.current;
    if (!panel) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focusableElements = getFocusableElements(panel);
    (focusableElements[0] ?? panel).focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscapeRef.current) {
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = getFocusableElements(panel);
      if (elements.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused?.isConnected)
        previouslyFocused.focus({ preventScroll: true });
    };
  }, [open, portalRoot, close]);

  if (!portalRoot) return null;

  return createPortal(
    <DrawerContext.Provider value={{ close }}>
      <div
        data-side={side}
        className={styles.root}
        data-state={open ? "open" : "closed"}
        data-full-screen={fullScreen ? "true" : "false"}
      >
        <div
          className={styles.overlay}
          onClick={closeOnOverlayClick ? close : undefined}
        />
        <section
          {...props}
          tabIndex={-1}
          ref={panelRef}
          className={clsx(styles.panel, className)}
        >
          {children}
        </section>
      </div>
    </DrawerContext.Provider>,
    portalRoot,
  );
}
