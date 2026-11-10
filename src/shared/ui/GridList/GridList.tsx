import { useLocation } from "react-router";
import { VirtuosoGrid } from "react-virtuoso";
import type { Key, ReactNode, HTMLAttributes } from "react";
import type {
  ContextProp,
  GridComponents,
  GridStateSnapshot,
} from "react-virtuoso";

import clsx from "clsx";

import * as styles from "./GridList.css";

function GridFooter({ context }: ContextProp<ReactNode>) {
  return context ? (
    <div className={styles.virtualizedFooter}>{context}</div>
  ) : null;
}

const gridComponents: GridComponents<ReactNode> = { Footer: GridFooter };
const MAX_SAVED_GRID_STATES = 40;
const gridStates = new Map<string, GridStateSnapshot>();

function saveGridState(key: string, state: GridStateSnapshot) {
  gridStates.delete(key);
  gridStates.set(key, state);
  if (gridStates.size > MAX_SAVED_GRID_STATES) {
    const oldestKey = gridStates.keys().next().value;
    if (oldestKey) gridStates.delete(oldestKey);
  }
}

export type GridListProps<T> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  data: readonly T[];
  footer?: ReactNode;
  virtualize?: boolean;
  endReached?: VoidFunction;
  initialTopMostItemIndex?: number;
  restoreVirtualizedState?: boolean;
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
  initialTopMostItemIndex,
  restoreVirtualizedState = true,
  ...props
}: GridListProps<T>) {
  if (virtualize) {
    return (
      <VirtualizedGridList
        data={data}
        footer={footer}
        getKey={getKey}
        className={className}
        renderItem={renderItem}
        endReached={endReached}
        initialTopMostItemIndex={initialTopMostItemIndex}
        restoreVirtualizedState={restoreVirtualizedState}
        {...props}
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

type VirtualizedGridListProps<T> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  data: readonly T[];
  footer?: ReactNode;
  className?: string;
  endReached?: VoidFunction;
  initialTopMostItemIndex?: number;
  restoreVirtualizedState?: boolean;
  getKey?: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
};

function VirtualizedGridList<T>({
  data,
  footer,
  getKey,
  className,
  renderItem,
  endReached,
  initialTopMostItemIndex,
  restoreVirtualizedState = true,
  ...props
}: VirtualizedGridListProps<T>) {
  const location = useLocation();
  const dataKey = JSON.stringify(
    data.map((item, index) => {
      const key = getKey?.(item, index) ?? index;
      return [typeof key, key];
    }),
  );
  const snapshotKey = `${location.key}:${dataKey}`;
  const restoredState = restoreVirtualizedState
    ? gridStates.get(snapshotKey)
    : undefined;

  return (
    <VirtuosoGrid
      {...props}
      data={data}
      useWindowScroll
      context={footer}
      className={className}
      endReached={endReached}
      components={gridComponents}
      restoreStateFrom={restoredState}
      itemClassName={styles.virtualizedItem}
      listClassName={styles.virtualizedList}
      itemContent={(index, item) => renderItem(item, index)}
      computeItemKey={(index, item) => getKey?.(item, index) ?? index}
      initialTopMostItemIndex={
        restoredState ? undefined : initialTopMostItemIndex
      }
      stateChanged={
        restoreVirtualizedState
          ? (state) => saveGridState(snapshotKey, state)
          : undefined
      }
    />
  );
}
