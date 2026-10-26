import { useState } from "react";
import type { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { PlusIcon, MinusIcon } from "../../icons";

import * as styles from "./Progress.css";

export type ProgressProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> & {
  max?: number;
  value?: number;
  label?: string;
  editable?: boolean;
  disabled?: boolean;
  defaultValue?: number;
  size?: "s" | "m" | "l";
  onValueChange?: (value: number) => void;
};

export function Progress({
  label,
  max = 12,
  className,
  size = "m",
  defaultValue,
  onValueChange,
  editable = true,
  disabled = false,
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

  const updateValue = (nextValue: number) => {
    if (controlledValue === undefined) {
      setLocalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const handleDecrease = () => {
    updateValue(Math.max(0, value - 1));
  };

  const handleIncrease = () => {
    updateValue(Math.min(max, value + 1));
  };

  return (
    <div {...props} className={clsx(styles.root, styles.size[size], className)}>
      <span className={styles.label}>
        {effectiveLabel + ": " + value + "/" + max}
      </span>
      <span className={clsx(styles.controls, styles.controlsSize[size])}>
        {editable && value > 0 && (
          <button
            type="button"
            disabled={disabled}
            onClick={handleDecrease}
            className={clsx(styles.control, styles.controlSize[size])}
          >
            <MinusIcon className={styles.controlIcon} />
          </button>
        )}
        {editable && !completed && (
          <button
            type="button"
            disabled={disabled}
            onClick={handleIncrease}
            className={clsx(styles.control, styles.controlSize[size])}
          >
            <PlusIcon className={styles.controlIcon} />
          </button>
        )}
      </span>
    </div>
  );
}
