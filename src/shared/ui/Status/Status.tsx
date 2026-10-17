import { useTranslation } from "react-i18next";
import type { ReactNode, HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Status.css";

export type StatusProps = HTMLAttributes<HTMLSpanElement> & {
  size?: "s" | "m";
  children?: ReactNode;
  variant?: "info" | "positive" | "negative";
};

const labelKeys = {
  info: "common:mediaStatus.ongoing",
  positive: "common:mediaStatus.released",
  negative: "common:mediaStatus.announced",
} as const satisfies Record<NonNullable<StatusProps["variant"]>, string>;

export function Status({
  children,
  className,
  size = "m",
  variant = "positive",
  ...props
}: StatusProps) {
  const { t } = useTranslation(["common"]);

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
      {children ?? t(labelKeys[variant])}
    </span>
  );
}
