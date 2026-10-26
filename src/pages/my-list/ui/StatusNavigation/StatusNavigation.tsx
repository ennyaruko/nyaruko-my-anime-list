import type { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import type { MyListStatus } from "@/entities/media";

import * as styles from "./StatusNavigation.css";

export type StatusNavigationProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "onSelect"
> & {
  loading?: boolean;
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
  loading = false,
  ...props
}: StatusNavigationProps) {
  const { t } = useTranslation(["common"]);

  return (
    <nav
      {...props}
      className={clsx(
        styles.root,
        {
          [styles.loading]: loading,
        },
        className,
      )}
    >
      {items.map(({ count, status }, index) => (
        <span key={status} className={styles.item}>
          <button
            type="button"
            disabled={loading}
            onClick={() => onSelect(status)}
            className={clsx({
              [styles.button.active]: selectedStatus === status,
              [styles.button.default]: selectedStatus !== status,
            })}
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
