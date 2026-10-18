import { useState } from "react";
import type { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { PlusIcon, MinusIcon } from "../../icons";

import * as styles from "./Progress.css";

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  max?: number;
  value?: number;
  label?: string;
  editable?: boolean;
  defaultValue?: number;
  size?: "s" | "m" | "l";
};

export function Progress({
  label,
  max = 12,
  className,
  size = "m",
  defaultValue,
  editable = true,
  value: controlledValue,
  ...props
}: ProgressProps) {
  const { t } = useTranslation(["common"]);
  const effectiveLabel = label ?? t("common:progress.label");
  const [localValue, setLocalValue] = useState(
    controlledValue ?? defaultValue ?? 4,
  );
  const value = controlledValue ?? localValue;
  const completed = value >= max;

  return (
    <div {...props} className={clsx(styles.root, styles.size[size], className)}>
      <span className={styles.label}>
        {effectiveLabel + ": " + value + "/" + max}
      </span>
      <span className={clsx(styles.controls, styles.controlsSize[size])}>
        {editable && (
          <button
            type="button"
            onClick={() => setLocalValue(Math.max(0, value - 1))}
            className={clsx(styles.control, styles.controlSize[size])}
          >
            <MinusIcon className={styles.controlIcon} />
          </button>
        )}
        {editable && !completed && (
          <button
            type="button"
            onClick={() => setLocalValue(Math.min(max, value + 1))}
            className={clsx(styles.control, styles.controlSize[size])}
          >
            <PlusIcon className={styles.controlIcon} />
          </button>
        )}
      </span>
    </div>
  );
}
