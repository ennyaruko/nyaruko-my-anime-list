import { style, globalStyle, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  alignItems: "center",
  display: "inline-flex",
  gap: primitives.spacing.xxxs,
});

export const size = styleVariants({
  s: {
    vars: {
      "--rating-star-size": "24px",
    },
  },
  m: {
    vars: {
      "--rating-star-size": "32px",
    },
  },
});

export const starFrame = style({
  margin: 0,
  border: 0,
  padding: 0,
  display: "block",
  cursor: "pointer",
  appearance: "none",
  overflow: "visible",
  position: "relative",
  touchAction: "pan-y",
  background: "transparent",
  width: "var(--rating-star-size)",
  height: "var(--rating-star-size)",
  flex: "0 0 var(--rating-star-size)",

  selectors: {
    "&:focus-visible": {
      borderRadius: "3px",
      outlineOffset: "2px",
      outline: `2px solid ${colors.status.warning}`,
    },
  },
});

export const starVisual = style({
  inset: 0,
  position: "absolute",
  pointerEvents: "none",
  width: "var(--rating-star-size)",
  height: "var(--rating-star-size)",
});

export const starIcon = style({
  flex: "none",
  display: "block",
  width: "var(--rating-star-size)",
  height: "var(--rating-star-size)",
});

export const starHitArea = style({
  top: 0,
  bottom: 0,
  content: '""',
  position: "absolute",
  left: `calc(${primitives.spacing.xxxs} * -0.5)`,
  right: `calc(${primitives.spacing.xxxs} * -0.5)`,
});

export const starEmpty = style({});

globalStyle(`${starEmpty} path`, {
  fill: colors.text.tertiary,
});

export const starFilled = style({
  inset: 0,
  position: "absolute",
});

globalStyle(`${starFilled} path`, {
  fill: colors.status.warning,
});

export const starHalf = style({});

globalStyle(`${starHalf} path:first-child`, {
  fill: colors.status.warning,
});

globalStyle(`${starHalf} path:last-child`, {
  fill: colors.text.tertiary,
});

export const compact = style({
  ...typography.caption["2xs"],
  alignItems: "center",
  display: "inline-flex",
  color: colors.text.primary,
  gap: primitives.spacing.xxxs,
});

export const compactStar = style({
  flex: "none",
  width: "15px",
  height: "15px",
  display: "block",
});

globalStyle(`${compactStar} path`, {
  fill: colors.status.warning,
});
