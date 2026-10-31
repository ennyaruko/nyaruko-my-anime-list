import { useId, useRef, useState, useEffect, type ReactNode } from "react";

import clsx from "clsx";

import { Button } from "../Button";

import * as styles from "./CollapsibleContent.css";

/** Measures rendered content, including images, so short text needs no toggle. */
export function CollapsibleContent({
  children,
  expandLabel,
  collapseLabel,
  collapsedHeight = 160,
}: {
  children: ReactNode;
  expandLabel: string;
  collapseLabel: string;
  collapsedHeight?: number;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const element = content.current;
    if (!element) return;
    const measure = () =>
      setOverflowing(
        element.getBoundingClientRect().height > collapsedHeight + 1,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [collapsedHeight]);
  return (
    <div ref={root} className={styles.root}>
      <div
        id={id}
        style={{ maxHeight: expanded ? undefined : collapsedHeight }}
        className={clsx(
          styles.viewport,
          overflowing && !expanded && styles.faded,
        )}
      >
        <div ref={content} className={styles.content}>
          {children}
        </div>
      </div>
      {overflowing && (
        <Button
          type="button"
          aria-controls={id}
          aria-expanded={expanded}
          variant={expanded ? "primary" : "flat"}
          className={clsx(styles.toggle, expanded && styles.toggleSticky)}
          onClick={() => {
            if (
              expanded &&
              root.current &&
              root.current.getBoundingClientRect().top < 0
            )
              root.current.scrollIntoView({ block: "start" });
            setExpanded((value) => !value);
          }}
        >
          <span>{expanded ? collapseLabel : expandLabel}</span>
          <span aria-hidden="true" className={styles.toggleArrow}>
            {expanded ? "↑" : "↓"}
          </span>
        </Button>
      )}
    </div>
  );
}
