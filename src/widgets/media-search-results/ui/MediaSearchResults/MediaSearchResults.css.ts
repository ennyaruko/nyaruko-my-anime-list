import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const empty = style({
  margin: "auto",
  alignSelf: "center",
});
export const returnButton = style({
  alignSelf: "flex-start",
  marginBottom: primitives.spacing.m,
});
export const resultsContainer = style({
  minHeight: 0,
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
});
export const skeletonGrid = style({
  display: "grid",
  rowGap: primitives.spacing.xl,
  columnGap: primitives.spacing.m,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  "@media": {
    "(min-width: 768px)": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
    "(min-width: 1024px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(179px, 1fr))",
    },
  },
});
