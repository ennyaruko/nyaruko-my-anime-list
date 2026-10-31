import type { ComponentPropsWithoutRef } from "react";

import clsx from "clsx";

import type {
  AlignItem,
  SpacingToken,
  FlexDirection,
  JustifyContent,
} from "../types";

import { gap } from "../gap.css";
import * as styles from "./Row.css";
import * as layoutStyles from "../layout.css";

export type RowProps = ComponentPropsWithoutRef<"div"> & {
  wide?: boolean;
  tall?: boolean;
  wrap?: boolean;
  gap?: SpacingToken;
  alignItem?: AlignItem;
  direction?: FlexDirection;
  justifyContent?: JustifyContent;
};

export function Row({
  className,
  wide = false,
  tall = false,
  wrap = false,
  direction = "row",
  gap: gapSize = "s",
  alignItem = "stretch",
  justifyContent = "flex-start",
  ...props
}: RowProps) {
  return (
    <div
      {...props}
      className={clsx(
        styles.root,
        { [layoutStyles.direction[direction]]: Boolean(direction) },
        { [layoutStyles.alignItem[alignItem]]: Boolean(alignItem) },
        {
          [layoutStyles.justifyContent[justifyContent]]:
            Boolean(justifyContent),
        },
        { [layoutStyles.wide]: wide },
        { [layoutStyles.tall]: tall },
        { [layoutStyles.wrap]: wrap },
        { [gap[gapSize]]: Boolean(gapSize) },
        className,
      )}
    />
  );
}
