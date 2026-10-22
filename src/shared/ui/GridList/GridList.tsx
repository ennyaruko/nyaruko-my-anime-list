import type { Key, ReactNode, HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./GridList.css";

export type GridListProps<T> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  data: readonly T[];
  getKey?: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
};

export function GridList<T>({
  data,
  getKey,
  className,
  renderItem,
  ...props
}: GridListProps<T>) {
  return (
    <div {...props} className={clsx(styles.root, className)}>
      {data.map((item, index) => (
        <div key={getKey?.(item, index) ?? index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
