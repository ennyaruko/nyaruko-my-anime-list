import type { ReactNode, ChangeEvent, ComponentPropsWithoutRef } from "react";

import clsx from "clsx";

import * as styles from "./Switch.css";

type BinarySwitchProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "checked" | "onChange" | "defaultChecked"
> & {
  checked: boolean;
  children?: ReactNode;
  thumbClassName?: string;
  trackClassName?: string;
  onCheckedChange: (checked: boolean) => void;
};

type ThreePositionSwitchProps = {
  label: string;
  checked?: never;
  className?: string;
  disabled?: boolean;
  position: 0 | 1 | 2;
  children?: ReactNode;
  thumbClassName?: string;
  trackClassName?: string;
  onCheckedChange?: never;
  onPositionChange: (position: 0 | 1 | 2) => void;
};

export type SwitchProps = BinarySwitchProps | ThreePositionSwitchProps;

export function Switch(props: SwitchProps) {
  if ("position" in props) {
    return <ThreePositionSwitch {...props} />;
  }

  return <BinarySwitch {...props} />;
}

function BinarySwitch({
  checked,
  children,
  className,
  thumbClassName,
  trackClassName,
  onCheckedChange,
  ...inputProps
}: BinarySwitchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCheckedChange(event.currentTarget.checked);
  };

  return (
    <span className={clsx(styles.root, className)}>
      <input
        {...inputProps}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={styles.input}
      />
      <span className={clsx(styles.track, trackClassName)} />
      <span
        className={clsx(
          styles.thumb,
          {
            [styles.thumbState.checked]: checked,
            [styles.thumbState.unchecked]: !checked,
          },
          thumbClassName,
        )}
      >
        {children}
      </span>
    </span>
  );
}

function ThreePositionSwitch({
  label,
  position,
  children,
  disabled,
  className,
  thumbClassName,
  trackClassName,
  onPositionChange,
}: ThreePositionSwitchProps) {
  const nextPosition = (position === 2 ? 0 : position + 1) as 0 | 1 | 2;

  return (
    <span
      data-switch-position={position}
      className={clsx(styles.root, className)}
    >
      <input
        title={label}
        type="checkbox"
        aria-label={label}
        disabled={disabled}
        checked={position !== 0}
        className={styles.input}
        onChange={() => onPositionChange(nextPosition)}
      />
      <span className={clsx(styles.track, trackClassName)} />
      <span
        className={clsx(
          styles.thumb,
          styles.threePositionThumb,
          thumbClassName,
        )}
      >
        {children}
      </span>
    </span>
  );
}
