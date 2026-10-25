import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const page = style({
  display: "flex",
  flexDirection: "column",
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
  minHeight: "calc(100svh - 55px - env(safe-area-inset-bottom))",
});

export const searchIcon = style({ width: "20px", height: "20px" });
export const initialLoading = style({ margin: "auto" });
export const empty = style({
  width: "100%",
  margin: "auto",
  alignSelf: "center",
});
export const resultsContainer = style({
  minHeight: 0,
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
});
export const results = style({ marginTop: primitives.spacing.m });
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
