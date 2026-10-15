import type { ReactNode, HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Status.css";

export type StatusProps = HTMLAttributes<HTMLSpanElement> & {
  size?: "s" | "m";
  children?: ReactNode;
  variant?: "info" | "positive" | "negative";
};

const labels = {
  info: "Онгоинг",
  positive: "Вышел",
  negative: "Анонс",
} satisfies Record<NonNullable<StatusProps["variant"]>, string>;

export function Status({
  children,
  className,
  size = "m",
  variant = "positive",
  ...props
}: StatusProps) {
  return (
    <span
      {...props}
      className={clsx(
        styles.root,
        styles.variant[variant],
        styles.size[size],
        className,
      )}
    >
      {children ?? labels[variant]}
    </span>
  );
}
