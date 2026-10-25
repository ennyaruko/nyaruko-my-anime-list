import { useState } from "react";
import type {
  Ref,
  ReactNode,
  ChangeEventHandler,
  InputHTMLAttributes,
} from "react";

import clsx from "clsx";

import { CloseIcon } from "../../icons";

import * as styles from "./Input.css";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "onChange" | "defaultValue"
> & {
  round?: boolean;
  shadow?: boolean;
  size?: "m" | "l";
  cleanable?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  onClear?: VoidFunction;
  inputRef?: Ref<HTMLInputElement>;
  variant?: "default" | "grayscale";
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string | number | readonly string[];
};

export function Input({
  value,
  onClear,
  leftSlot,
  onChange,
  inputRef,
  className,
  rightSlot,
  size = "m",
  defaultValue,
  round = false,
  shadow = false,
  cleanable = false,
  variant = "default",
  ...props
}: InputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const currentValue = value ?? internalValue;
  const hasValue = String(currentValue).length > 0;
  const showClear = cleanable && hasValue && !props.disabled && !props.readOnly;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (value === undefined) setInternalValue(event.currentTarget.value);
    onChange?.(event);
  };

  const clearValue = () => {
    if (value === undefined) setInternalValue("");
    onClear?.();
  };

  return (
    <div
      className={clsx(
        styles.wrapper,
        styles.variant[variant],
        styles.size[size],
        {
          [styles.round]: round,
          [styles.shadow]: shadow,
        },
        className,
      )}
    >
      {leftSlot && <span className={styles.slot}>{leftSlot}</span>}
      <input
        {...props}
        ref={inputRef}
        value={currentValue}
        onChange={handleChange}
        className={styles.input}
      />
      {rightSlot && <span className={styles.slot}>{rightSlot}</span>}
      {showClear && (
        <button
          type="button"
          onClick={clearValue}
          className={styles.clearButton}
          onMouseDown={(event) => event.preventDefault()}
        >
          <CloseIcon className={styles.clearIcon} />
        </button>
      )}
    </div>
  );
}
