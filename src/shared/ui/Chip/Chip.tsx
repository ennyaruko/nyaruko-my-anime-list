import type { ReactElement, HTMLAttributes } from "react";

import clsx from "clsx";
import { Slot } from "radix-ui";

import * as styles from "./Chip.css";

export type ChipProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  label?: string;
  icon: ReactElement;
  size?: "l" | "m" | "s";
};

export function Chip({
  icon,
  label,
  className,
  size = "m",
  ...props
}: ChipProps) {
  return (
    <span {...props} className={clsx(styles.root, className)}>
      {label && <span className={styles.label}>{label}</span>}
      <Slot.Root className={clsx(styles.icon, styles.iconSize[size])}>
        {icon}
      </Slot.Root>
    </span>
  );
}
