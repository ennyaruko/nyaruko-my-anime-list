import type { HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Score.css";

export type ScoreProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  value: number;
  size?: "s" | "m";
  shadow?: boolean;
  variant?: "warning" | "negative" | "positive";
};

export function Score({
  value,
  variant,
  className,
  size = "m",
  shadow = true,
  ...props
}: ScoreProps) {
  const resolvedVariant =
    variant ??
    (Number.isFinite(value)
      ? value >= 7
        ? "positive"
        : value >= 6
          ? "warning"
          : "negative"
      : "positive");

  return (
    <span
      {...props}
      className={clsx(
        styles.score,
        styles.scoreSize[size],
        styles.scoreVariant[resolvedVariant],
        { [styles.shadow]: shadow },
        className,
      )}
    >
      {value === 10 ? "10" : value.toFixed(1)}
    </span>
  );
}
