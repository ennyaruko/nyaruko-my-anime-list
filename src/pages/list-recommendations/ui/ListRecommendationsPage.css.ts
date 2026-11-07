import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const page = style({
  display: "flex",
  flexDirection: "column",
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
  minHeight: "calc(100svh - 55px - env(safe-area-inset-bottom))",
  "@media": {
    "(min-width: 768px)": {
      minHeight: "calc(100svh - 80px - env(safe-area-inset-bottom))",
    },
  },
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

export const resultsContainer = style({
  minHeight: 0,
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
});

export const toolbar = style({
  flexWrap: "nowrap",
});

export const randomToggle = style({
  width: "auto",
  flex: "0 0 auto",
  whiteSpace: "nowrap",
});

export const sort = style({
  minWidth: 0,
  width: "auto",
  flex: "1 1 auto",
});
