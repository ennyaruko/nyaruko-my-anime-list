import type { ReactNode, HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Header.css";

export type HeaderProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  center?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  variant?: "plain" | "drawer";
};

export function Header({
  center,
  leading,
  trailing,
  className,
  variant = "drawer",
  ...props
}: HeaderProps) {
  return (
    <div
      {...props}
      className={clsx(styles.root, styles.variant[variant], className)}
    >
      <div className={styles.leading}>{leading}</div>
      <div className={styles.center}>{center}</div>
      <div className={styles.trailing}>{trailing}</div>
    </div>
  );
}
