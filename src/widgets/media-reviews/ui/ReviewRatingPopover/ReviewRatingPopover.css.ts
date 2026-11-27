import { style, styleVariants } from "@vanilla-extract/css";

import { colors, darkTheme, primitives, typography } from "@/shared/styles";

export const trigger = style({
  border: 0,
  flex: "none",
  cursor: "pointer",
  placeItems: "center",
  display: "inline-grid",
  background: "transparent",
  color: colors.text.secondary,
  padding: primitives.spacing.xxs,
  borderRadius: primitives.radii.s,
  margin: `calc(${primitives.spacing.xxs} * -1)`,
  selectors: {
    "&:hover, &:focus-visible": { color: colors.text.action },
    "&:focus-visible": { outline: `2px solid ${colors.border.secondary}` },
  },
});

export const icon = style({ width: "18px", height: "18px" });

export const content = style({
  boxSizing: "border-box",
  color: colors.text.primary,
  padding: primitives.spacing.s,
  zIndex: primitives.zIndex.popover,
  borderRadius: primitives.radii.sm,
  boxShadow: primitives.shadow.popup,
  width: "min(340px, calc(100vw - 24px))",
  backgroundColor: colors.background.base,
  selectors: {
    [`${darkTheme} &`]: {
      backgroundColor: colors.background.elevation1,
    },
  },
});

export const primaryRating = style({
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xs,
  paddingBottom: primitives.spacing.xs,
  borderBottom: `1px solid ${colors.border.normal}`,
});

export const category = styleVariants({
  warning: { ...typography.body.s, color: colors.text.warning },
  positive: { ...typography.body.s, color: colors.text.positive },
  negative: { ...typography.body.s, color: colors.text.negative },
});

export const details = style({
  display: "grid",
  gap: primitives.spacing.xxs,
  padding: `${primitives.spacing.xs} 0`,
  borderBottom: `1px solid ${colors.border.normal}`,
});

export const detailRow = style({
  display: "flex",
  alignItems: "baseline",
  gap: primitives.spacing.xs,
  justifyContent: "space-between",
  ...typography.body.s,
});

export const detailLabel = style({ color: colors.text.secondary });

export const agreementHeader = style({
  display: "flex",
  alignItems: "baseline",
  gap: primitives.spacing.xs,
  justifyContent: "space-between",
  ...typography.body.s,
});

export const agreement = style({
  display: "grid",
  gap: primitives.spacing.xxs,
});

export const reactionBar = style({
  flex: 1,
  minWidth: 0,
  width: "100%",
  height: "6px",
  display: "flex",
  overflow: "hidden",
  borderRadius: primitives.radii.s,
  background: colors.background.elevation2,
});

export const positiveBar = style({ background: colors.status.positive });
export const negativeBar = style({ background: colors.status.negative });

export const footer = style({
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xs,
  justifyContent: "space-between",
  paddingTop: primitives.spacing.xs,
  ...typography.caption.xs,
});

export const button = style({
  border: 0,
  font: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap",
  color: colors.text.action,
  background: "transparent",
  padding: primitives.spacing.xxs,
  margin: `calc(${primitives.spacing.xxs} * -1)`,
  selectors: { "&:disabled": { opacity: 0.7, cursor: "wait" } },
});

export const muted = style({ color: colors.text.secondary });
