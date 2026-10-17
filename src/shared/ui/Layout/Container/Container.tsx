import type { ElementType, ComponentPropsWithoutRef } from "react";

import clsx from "clsx";

import * as styles from "./Container.css";

export type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return <Component {...props} className={clsx(styles.root, className)} />;
}
