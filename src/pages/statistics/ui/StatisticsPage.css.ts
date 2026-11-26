import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const page = style({
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
});

export const summaryGrid = style({
  display: "grid",
  gap: primitives.spacing.s,
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 175px), 1fr))",
});

export const summaryCard = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: primitives.spacing.xxs,
  padding: primitives.spacing.xs,
  background: colors.background.elevation1,
  borderLeft: `4px solid ${colors.text.info}`,
});

export const summaryValue = style({
  ...typography.heading["2xl"],
  color: colors.text.info,
});

export const summaryLabel = style({
  ...typography.caption["2xs"],
  color: colors.text.secondary,
});

export const summarySkeleton = style({
  display: "grid",
  gap: primitives.spacing.s,
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 175px), 1fr))",
});

export const summaryCardSkeleton = style({
  height: "80px",
  background: colors.background.elevation1,
});
