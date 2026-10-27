import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xs,
});

export const viewport = style({
  overflow: "hidden",
  touchAction: "pan-y pinch-zoom",
});

export const track = style({
  display: "flex",
  gap: primitives.spacing.xs,
});

export const slide = style({
  minWidth: 0,
  flex: "0 0 32%",
  position: "relative",
  "@media": {
    "(min-width: 520px)": { flexBasis: "23%" },
    "(min-width: 768px)": { flexBasis: "20%" },
  },
});

export const skeleton = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
});

export const skeletonCover = style({
  width: "100%",
  aspectRatio: "126 / 180",
});

export const skeletonTitle = style({
  width: "100%",
  height: "32px",
});

export const skeletonMeta = style({
  width: "100%",
  height: "13px",
});
