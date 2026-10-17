import { useTranslation } from "react-i18next";
import type { ReactNode, HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Heading.css";

export type HeadingProps = HTMLAttributes<HTMLDivElement> & {
  size?: "s" | "m";
  action?: ReactNode;
  children?: ReactNode;
  variant?: "info" | "neutral" | "warning" | "positive" | "negative";
};

const labelKeys = {
  info: "common:watchStatus.watching",
  warning: "common:watchStatus.onHold",
  neutral: "common:watchStatus.planned",
  negative: "common:watchStatus.dropped",
  positive: "common:watchStatus.completed",
} as const satisfies Record<NonNullable<HeadingProps["variant"]>, string>;

export function Heading({
  action,
  children,
  className,
  size = "m",
  variant = "info",
  ...props
}: HeadingProps) {
  const { t } = useTranslation(["common"]);

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
      {children ?? t(labelKeys[variant])}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
