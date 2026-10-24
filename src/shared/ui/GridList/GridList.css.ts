import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const root = style({
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

export const virtualizedList = style({
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

export const virtualizedItem = style({
  minWidth: 0,
  width: "100%",
  boxSizing: "border-box",
});
