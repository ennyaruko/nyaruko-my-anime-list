import { useState } from "react";
import type { ReactNode, ComponentPropsWithoutRef } from "react";

import clsx from "clsx";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { skeletonAnimation } from "../../styles";
import { CheckIcon, MinusWideIcon } from "../../icons";

import * as styles from "./Checkbox.css";

export type CheckboxVariant = "minus" | "default";
export type CheckboxProps = ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  variant?: CheckboxVariant;
};

export function Checkbox({
  className,
  defaultChecked,
  variant = "default",
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      defaultChecked={defaultChecked}
      className={clsx(
        styles.root,
        styles.checkboxRoot,
        styles.checkboxVariant[variant],
        className,
      )}
    >
      <CheckboxPrimitive.Indicator className={styles.checkboxCheck}>
        {variant === "minus" ? (
          <MinusWideIcon className={styles.checkboxMinus} />
        ) : (
          <CheckIcon className={styles.checkboxCheckIcon} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export type LabeledCheckboxProps = {
  size?: "l" | "s";
  label: ReactNode;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  description?: ReactNode;
  defaultChecked?: boolean;
  variant?: CheckboxVariant;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
};

export function LabeledCheckbox({
  label,
  checked,
  className,
  size = "l",
  description,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  variant = "default",
}: LabeledCheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    defaultChecked ?? false,
  );
  const active = checked ?? uncontrolledChecked;
  const handleCheckedChange = (nextChecked: boolean | "indeterminate") => {
    if (checked === undefined) setUncontrolledChecked(nextChecked === true);
    onCheckedChange?.(nextChecked);
  };

  return (
    <label
      className={clsx(
        styles.labeled,
        {
          [styles.labeledChecked]: active,
          [styles.labeledDisabled]: disabled,
        },
        className,
      )}
    >
      <Checkbox
        checked={active}
        variant={variant}
        disabled={disabled}
        className={styles.labeledControl}
        onCheckedChange={handleCheckedChange}
      />
      <span
        className={clsx(styles.label, styles.labelSizes[size], {
          [styles.selectedLabel]: active,
        })}
      >
        {label}
      </span>
      {active && Boolean(description) && (
        <span className={styles.description}>{description}</span>
      )}
    </label>
  );
}

export type LabeledCheckboxSkeletonProps = { className?: string };

export function LabeledCheckboxSkeleton({
  className,
}: LabeledCheckboxSkeletonProps) {
  return (
    <div className={clsx(styles.labeledSkeleton, className)}>
      <span className={clsx(styles.skeletonCheckbox, skeletonAnimation)} />
      <span className={clsx(styles.skeletonLine, skeletonAnimation)} />
    </div>
  );
}
