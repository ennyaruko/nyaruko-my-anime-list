import type { ReactNode, HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Heading.css";

export type HeadingProps = HTMLAttributes<HTMLDivElement> & {
  size?: "s" | "m";
  action?: ReactNode;
  children?: ReactNode;
  variant?: "info" | "neutral" | "warning" | "positive" | "negative";
};

const labels = {
  info: "Смотрю",
  warning: "Отложено",
  negative: "Брошено",
  positive: "Просмотрено",
  neutral: "Запланировано",
} satisfies Record<NonNullable<HeadingProps["variant"]>, string>;

export function Heading({
  action,
  children,
  className,
  size = "m",
  variant = "info",
  ...props
}: HeadingProps) {
  return (
    <div
      {...props}
      className={clsx(
        styles.root,
        styles.variant[variant],
        styles.size[size],
        className,
      )}
    >
      {children ?? labels[variant]}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
