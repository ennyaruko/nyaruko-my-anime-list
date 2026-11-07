import { style } from "@vanilla-extract/css";

import { colors, primitives } from "@/shared/styles";

export const lightbox = style({
  vars: {
    "--yarl__container_background_color": colors.background.overlay,
  },
});

export const section = style({
  minWidth: 0,
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
  flex: "0 0 42%",
  position: "relative",
  "@media": {
    "(min-width: 520px)": { flexBasis: "32%" },
    "(min-width: 768px)": { flexBasis: "25%" },
  },
});

export const thumbnailButton = style({
  border: 0,
  padding: 0,
  width: "100%",
  display: "block",
  cursor: "pointer",
  overflow: "hidden",
  aspectRatio: "16 / 9",
  background: colors.background.neutral2,
  selectors: {
    "&:focus-visible": {
      outlineOffset: "2px",
      outline: `2px solid ${colors.text.action}`,
    },
  },
});

export const thumbnail = style({
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
});

export const skeletonTrack = style({
  minWidth: 0,
  display: "flex",
  overflow: "hidden",
  gap: primitives.spacing.xs,
});

export const skeleton = style({
  flex: "0 0 42%",
  aspectRatio: "16 / 9",
  background: colors.background.neutral2,
  "@media": {
    "(min-width: 520px)": { flexBasis: "32%" },
    "(min-width: 768px)": { flexBasis: "25%" },
  },
});
