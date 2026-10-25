import type { ReactNode, ChangeEvent, ComponentPropsWithoutRef } from "react";

import clsx from "clsx";

import * as styles from "./Switch.css";

export type SwitchProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "checked" | "onChange" | "defaultChecked"
> & {
  checked: boolean;
  children?: ReactNode;
  thumbClassName?: string;
  trackClassName?: string;
  onCheckedChange: (checked: boolean) => void;
};

export function Switch({
  checked,
  children,
  className,
  thumbClassName,
  trackClassName,
  onCheckedChange,
  ...inputProps
}: SwitchProps) {
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
