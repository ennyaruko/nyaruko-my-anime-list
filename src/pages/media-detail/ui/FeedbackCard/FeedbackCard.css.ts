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

export const bodyCollapsed = style({
  maxHeight: "100px",
  overflow: "hidden",
  selectors: {
    "&::after": {
      left: 0,
      right: 0,
      bottom: 0,
      content: '""',
      height: "100px",
      position: "absolute",
      pointerEvents: "none",
      background: `linear-gradient(transparent, ${colors.background.base})`,
    },
  },
});

export const toggle = style({
  height: "13px",
  minHeight: "13px",
  width: "fit-content",
  alignSelf: "flex-end",
  color: colors.text.action,
  background: "transparent",
  gap: primitives.spacing.tiny,
  selectors: {
    "&&": {
      padding: 0,
      height: "13px",
      minHeight: "13px",
      background: "transparent",
      color: colors.text.action,
    },
  },
});

export const toggleSticky = style({
  zIndex: 2,
  width: "90px",
  height: "28px",
  minHeight: "28px",
  position: "sticky",
  alignSelf: "flex-end",
  color: colors.text.primary,
  justifyContent: "space-between",
  boxShadow: primitives.shadow.xs,
  background: colors.background.elevation1,
  padding: `${primitives.spacing.xxxs} ${primitives.spacing.xxs}`,
  bottom: `calc(55px + env(safe-area-inset-bottom) + ${primitives.spacing.xxs})`,
  selectors: {
    "&&": {
      width: "90px",
      height: "28px",
      minHeight: "28px",
      color: colors.text.primary,
      background: colors.background.elevation1,
      padding: `${primitives.spacing.xxxs} ${primitives.spacing.xxs}`,
    },
  },
});

export const toggleArrow = style({
  width: "20px",
  flexShrink: 0,
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "center",
  color: colors.text.action,
});

export const summarySkeleton = style({ width: "100%", height: "28px" });
export const bodySkeleton = style({ width: "100%", height: "200px" });
export const bodySkeletonOpen = style({ height: "530px" });
export const toggleSkeleton = style({ width: "82px", height: "13px" });
