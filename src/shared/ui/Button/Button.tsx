import type { ReactElement, ButtonHTMLAttributes } from "react";

import clsx from "clsx";
import { Slot } from "radix-ui";

import * as styles from "./Button.css";

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "size" | "disabled"
> & {
  round?: boolean;
  size?: "s" | "l";
  disabled?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  variant?: "flat" | "primary" | "secondary";
};

export function Button({
  children,
  leftIcon,
  className,
  rightIcon,
  size = "s",
  round = false,
  type = "button",
  disabled = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={clsx(
        styles.button,
        styles.variant[variant],
        styles.size[size],
        round && styles.round,
        className,
      )}
    >
      {leftIcon && <Slot.Root className={styles.icon}>{leftIcon}</Slot.Root>}
      {children}
      {rightIcon && <Slot.Root className={styles.icon}>{rightIcon}</Slot.Root>}
    </button>
  );
}
