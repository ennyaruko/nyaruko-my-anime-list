import { VirtuosoGrid } from "react-virtuoso";
import type { Key, ReactNode, HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./GridList.css";

export type GridListProps<T> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  data: readonly T[];
  virtualize?: boolean;
  getKey?: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
};

export function GridList<T>({
  data,
  getKey,
  className,
  renderItem,
  virtualize = false,
  ...props
}: GridListProps<T>) {
  if (virtualize) {
    return (
      <VirtuosoGrid
        {...props}
        data={data}
        useWindowScroll
        className={className}
        itemClassName={styles.virtualizedItem}
        listClassName={styles.virtualizedList}
        itemContent={(index, item) => renderItem(item, index)}
        computeItemKey={(index, item) => getKey?.(item, index) ?? index}
      />
    );
  }

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
