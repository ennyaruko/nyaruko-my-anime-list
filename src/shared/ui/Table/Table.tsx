import { useTranslation } from "react-i18next";
import {
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

import clsx from "clsx";

import { primitives } from "../../styles";

import * as styles from "./Table.css";
import { skeleton as skeletonAnimation } from "../../styles/common/skeleton.css";

export type TableDatum = {
  label: string;
  value: number;
};

export type TableValueMode = "relative" | "percentage";

export type TableProps = HTMLAttributes<HTMLDivElement> & {
  items: TableDatum[];
  showAllLabel?: string;
  numericList?: boolean;
  showLessLabel?: string;
  valueMode?: TableValueMode;
  initialVisibleCount?: number;
  onItemClick?: (item: TableDatum) => void;
};

export type TableItemProps = HTMLAttributes<HTMLDivElement> & TableDatum;

type TableRowProps = TableDatum & {
  widthPercent: number;
  originalLabel: string;
  showPercent?: boolean;
  onItemClick?: (item: TableDatum) => void;
};

function clampValue(value: number) {
  return Math.min(1000, Math.max(0, value));
}

function getRelativeWidth(value: number, maxValue: number) {
  if (maxValue === 0) return 0;

  return (clampValue(value) / maxValue) * 100;
}

function getItemBackground(value: number) {
  if (value >= 70) return styles.row.table1;
  if (value >= 40 && value < 70) return styles.row.table2;
  if (value >= 0 && value < 40) return styles.row.table3;
  return undefined;
}

function TableRow({
  label,
  value,
  onItemClick,
  widthPercent,
  originalLabel,
  showPercent = false,
}: TableRowProps) {
  const normalizedValue = clampValue(value);
  const backgroundClass = getItemBackground(normalizedValue);
  const hasBackground = Boolean(backgroundClass);
  const item = { value, label: originalLabel };
  const valueLabel = showPercent ? `${value}%` : value;
  const valueAfterLabel = !hasBackground || widthPercent < 35;
  const itemContentClassName = clsx(styles.itemContent, {
    [styles.itemContentFlow]: valueAfterLabel,
  });
  const valueClassName = clsx(styles.value, {
    [styles.valueAfterLabel]: valueAfterLabel,
  });
  const itemStyle: CSSProperties & { "--fill-width": string } = {
    width: "100%",
    "--fill-width": `${widthPercent}%`,
  };
  const textContent = (
    <span
      className={itemContentClassName}
      style={
        hasBackground
          ? {
              clipPath: `inset(0 0 0 calc(${widthPercent}% - ${primitives.spacing.xxxs}))`,
            }
          : undefined
      }
    >
      <span className={styles.label}>{label}</span>
      <span className={valueClassName}>{valueLabel}</span>
    </span>
  );
  const filledTextContent = (
    <span
      aria-hidden="true"
      className={styles.itemOverlay}
      style={{ clipPath: `inset(0 calc(100% - ${widthPercent}%) 0 0)` }}
    >
      <span className={itemContentClassName}>
        <span className={styles.label}>{label}</span>
        <span className={valueClassName}>{valueLabel}</span>
      </span>
    </span>
  );
  const rowContent = (
    <>
      {hasBackground && (
        <span
          aria-hidden="true"
          className={clsx(styles.fill, backgroundClass)}
        />
      )}
      {textContent}
      {hasBackground && filledTextContent}
    </>
  );
  const rowClassName = clsx(styles.item, {
    [styles.itemClickable]: Boolean(onItemClick),
  });
  const handleClick = () => onItemClick?.(item);

  if (onItemClick) {
    return (
      <button
        type="button"
        style={itemStyle}
        onClick={handleClick}
        className={rowClassName}
      >
        {rowContent}
      </button>
    );
  }

  return (
    <div style={itemStyle} className={rowClassName}>
      {rowContent}
    </div>
  );
}

export function TableItem({
  label,
  value,
  style,
  className,
  ...props
}: TableItemProps) {
  const backgroundClass = getItemBackground(clampValue(value));
  const hasBackground = Boolean(backgroundClass);

  return (
    <div
      {...props}
      className={clsx(styles.item, className)}
      style={
        { ...style, width: "100%", "--fill-width": "100%" } as CSSProperties
      }
    >
      {hasBackground && (
        <span
          aria-hidden="true"
          className={clsx(styles.fill, styles.fillFull, backgroundClass)}
        />
      )}
      <span className={styles.itemContent}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </span>
      {hasBackground && (
        <span
          aria-hidden="true"
          className={clsx(styles.itemOverlay, styles.itemOverlayFull)}
        >
          <span className={styles.itemContent}>
            <span className={styles.label}>{label}</span>
            <span>{value}</span>
          </span>
        </span>
      )}
    </div>
  );
}

export function Table({
  items,
  className,
  onItemClick,
  showAllLabel,
  showLessLabel,
  numericList = false,
  valueMode = "relative",
  initialVisibleCount = 3,
  ...props
}: TableProps) {
  const { t } = useTranslation(["common"]);
  const [showAll, setShowAll] = useState(false);
  const visibleCount = Math.max(0, Math.floor(initialVisibleCount));
  const visibleItems = showAll ? items : items.slice(0, visibleCount);
  const hasToggle = items.length > visibleCount;
  const toggleLabel = showAll
    ? (showLessLabel ?? t("common:table.showLess"))
    : (showAllLabel ?? t("common:table.showAll"));
  const maxValue = useMemo(
    () =>
      valueMode === "relative"
        ? items.reduce((max, item) => Math.max(max, clampValue(item.value)), 0)
        : 0,
    [items, valueMode],
  );

  return (
    <div {...props} className={clsx(styles.root, className)}>
      <div className={styles.rows}>
        {visibleItems.map((item, index) => (
          <TableRow
            key={`${item.label}-${index}`}
            {...item}
            onItemClick={onItemClick}
            originalLabel={item.label}
            showPercent={valueMode === "percentage"}
            label={numericList ? `${index + 1}. ${item.label}` : item.label}
            widthPercent={
              valueMode === "percentage"
                ? clampValue(item.value)
                : getRelativeWidth(item.value, maxValue)
            }
          />
        ))}
      </div>
      {hasToggle && (
        <button
          type="button"
          className={styles.more}
          onClick={() => setShowAll(!showAll)}
        >
          {toggleLabel}
        </button>
      )}
    </div>
  );
}

export type TableSkeletonProps = HTMLAttributes<HTMLDivElement> & {
  values: number[];
  valueMode?: TableValueMode;
};

export function TableSkeleton({
  values,
  className,
  valueMode = "relative",
  ...props
}: TableSkeletonProps) {
  const { t } = useTranslation(["common"]);
  const maxValue = useMemo(
    () =>
      valueMode === "relative"
        ? values.reduce((max, value) => Math.max(max, clampValue(value)), 0)
        : 0,
    [values, valueMode],
  );

  return (
    <div {...props} aria-busy="true" className={clsx(styles.root, className)}>
      <div className={styles.rows}>
        {values.map((value, index) => (
          <span
            key={index}
            className={clsx(styles.bar, skeletonAnimation)}
            style={{
              width: `${valueMode === "percentage" ? clampValue(value) : getRelativeWidth(value, maxValue)}%`,
            }}
          />
        ))}
      </div>
      <button disabled type="button" className={styles.more}>
        {t("common:table.showAll")}
      </button>
    </div>
  );
}
