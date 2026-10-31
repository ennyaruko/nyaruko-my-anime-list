import type { ComponentProps } from "react";
import PullToRefreshLibrary from "react-simple-pull-to-refresh";

import clsx from "clsx";

import * as styles from "./PullToRefresh.css";

export type PullToRefreshProps = ComponentProps<typeof PullToRefreshLibrary>;

export function PullToRefresh({ className, ...props }: PullToRefreshProps) {
  return (
    <PullToRefreshLibrary {...props} className={clsx(styles.root, className)} />
  );
}
