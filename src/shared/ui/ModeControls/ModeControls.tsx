import { Fragment } from "react";

import clsx from "clsx";

import * as styles from "./ModeControls.css";

export type ModeControlsProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
};

export function ModeControls<T extends string>({
  value,
  options,
  onChange,
}: ModeControlsProps<T>) {
  return (
    <div className={styles.root}>
      {options.map((option, index) => (
        <Fragment key={option.value}>
          {index > 0 && <span className={styles.separator}>/</span>}
          <button
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              styles.button,
              value === option.value && styles.active,
            )}
          >
            {option.label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
