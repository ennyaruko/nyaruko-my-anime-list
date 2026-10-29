import type { HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Title.css";

export type TitleState =
  | "paused"
  | "default"
  | "dropped"
  | "planning"
  | "watching"
  | "repeating"
  | "completed";
export type TitleProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  variant?: TitleState;
};

export function Title({
  title,
  className,
  variant = "default",
  ...props
}: TitleProps) {
  return (
    <div {...props} className={clsx(styles.root, className)}>
      {variant !== "default" && (
        <span className={clsx(styles.marker, styles.state[variant])} />
      )}
      <span
        className={clsx(
          styles.text,
          variant !== "default" && styles.textWithMarker,
        )}
      >
        {title}
      </span>
    </div>
  );
}
