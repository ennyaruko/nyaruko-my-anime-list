import clsx from "clsx";

import { LoadingIcon } from "../../icons";

import * as styles from "./Spinner.css";

export type SpinnerProps = {
  size?: number;
  className?: string;
};

export function Spinner({ className, size = 20 }: SpinnerProps) {
  return (
    <LoadingIcon
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={clsx(styles.spinner, className)}
    />
  );
}
