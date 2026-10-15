import type { ReactNode } from "react";

import clsx from "clsx";
import { ScrollArea as RadixScrollArea } from "radix-ui";

import * as styles from "./ScrollArea.css";

export type ScrollAreaProps = {
  className?: string;
  children: ReactNode;
  viewportClassName?: string;
};

export function ScrollArea({
  children,
  className,
  viewportClassName,
}: ScrollAreaProps) {
  return (
    <RadixScrollArea.Root
      type="hover"
      scrollHideDelay={120}
      className={clsx(styles.root, className)}
    >
      <RadixScrollArea.Viewport
        className={clsx(styles.viewport, viewportClassName)}
      >
        {children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        forceMount
        orientation="vertical"
        className={styles.scrollbar}
      >
        <RadixScrollArea.Thumb className={styles.thumb} />
      </RadixScrollArea.Scrollbar>
    </RadixScrollArea.Root>
  );
}
