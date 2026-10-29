import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
});

export const date = style({
  ...typography.caption["2xs"],
  flexShrink: 0,
  color: colors.text.secondary,
});

export const reviewMeta = style({
  alignItems: "center",
  display: "inline-flex",
  gap: primitives.spacing.xxxs,
});

export const positiveVotes = style({
  ...typography.caption["2xs"],
  color: colors.status.positive,
});

export const voteSeparator = style({
  ...typography.caption["2xs"],
  color: colors.text.tertiary,
});

export const negativeVotes = style({
  ...typography.caption["2xs"],
  color: colors.status.negative,
});

export const summary = style({
  ...typography.heading["m-bold"],
  margin: 0,
  textAlign: "center",
  color: colors.text.primary,
  marginBottom: primitives.spacing.xxs,
});

export const body = style({
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
  overflowX: "hidden",
  position: "relative",
  overflowWrap: "anywhere",
  color: colors.text.primary,
  ...typography.caption["2xs"],
});

export const summarySkeleton = style({ width: "100%", height: "28px" });
export const bodySkeleton = style({ width: "100%", height: "200px" });
export const bodySkeletonOpen = style({ height: "530px" });
export const toggleSkeleton = style({ width: "82px", height: "13px" });
