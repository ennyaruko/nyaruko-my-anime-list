import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.m,
});

export const message = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: primitives.spacing.xs,
  color: colors.text.secondary,
  ...typography.body.s,
});

export const messageText = style({ margin: 0 });

export const retry = style({
  border: 0,
  padding: 0,
  font: "inherit",
  cursor: "pointer",
  color: colors.text.action,
  background: "transparent",
});

export const empty = style({
  display: "grid",
  minHeight: "120px",
  justifyItems: "center",
  alignContent: "center",
  gap: primitives.spacing.xxs,
  color: colors.text.secondary,
  borderRadius: primitives.radii.sm,
  background: colors.background.elevation1,
  ...typography.body.s,
});

export const emptyText = style({ margin: 0 });

export const emptyMark = style({
  lineHeight: 1,
  fontSize: "30px",
  color: colors.text.tertiary,
});

export const skeleton = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
});

export const skeletonCover = style({
  width: "100%",
  aspectRatio: "179 / 256",
  background: colors.background.elevation1,
});

export const skeletonTitle = style({
  height: "32px",
  borderRadius: primitives.radii.s,
  background: colors.background.elevation1,
});

export const skeletonRating = style({
  width: "64px",
  height: "20px",
  borderRadius: primitives.radii.s,
  background: colors.background.elevation1,
});
