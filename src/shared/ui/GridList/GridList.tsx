import { VirtuosoGrid } from "react-virtuoso";
import type { Key, ReactNode, HTMLAttributes } from "react";
import type { ContextProp, GridComponents } from "react-virtuoso";

import clsx from "clsx";

import * as styles from "./GridList.css";

function GridFooter({ context }: ContextProp<ReactNode>) {
  return context ? (
    <div className={styles.virtualizedFooter}>{context}</div>
  ) : null;
}

const gridComponents: GridComponents<ReactNode> = { Footer: GridFooter };

export type GridListProps<T> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  data: readonly T[];
  footer?: ReactNode;
  virtualize?: boolean;
  endReached?: VoidFunction;
  getKey?: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
};

export function GridList<T>({
  data,
  getKey,
  footer,
  className,
  renderItem,
  endReached,
  virtualize = false,
  ...props
}: GridListProps<T>) {
  if (virtualize) {
    return (
      <VirtuosoGrid
        {...props}
        data={data}
        useWindowScroll
        context={footer}
        className={className}
        endReached={endReached}
        components={gridComponents}
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
