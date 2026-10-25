import type { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import type { MyListStatus } from "@/entities/my-list";

import * as styles from "./StatusNavigation.css";

export type StatusNavigationProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "onSelect"
> & {
  selectedStatus: MyListStatus;
  onSelect: (status: MyListStatus) => void;
  items: { count: number; status: MyListStatus }[];
};

const statusLabels = {
  PAUSED: "paused",
  DROPPED: "dropped",
  CURRENT: "watching",
  PLANNING: "planned",
  COMPLETED: "completed",
} as const satisfies Record<MyListStatus, string>;

export function StatusNavigation({
  items,
  onSelect,
  className,
  selectedStatus,
  ...props
}: StatusNavigationProps) {
  const { t } = useTranslation(["common"]);

  return (
    <nav {...props} className={clsx(styles.root, className)}>
      {items.map(({ count, status }, index) => (
        <span key={status} className={styles.item}>
          <button
            type="button"
            onClick={() => onSelect(status)}
            className={
              styles.button[selectedStatus === status ? "active" : "default"]
            }
          >
            {t(`common:ui.watchStatus.${statusLabels[status]}`)} ({count})
          </button>
          {index < items.length - 1 && (
            <span className={styles.separator}>/</span>
          )}
        </span>
      ))}
    </nav>
  );
}
