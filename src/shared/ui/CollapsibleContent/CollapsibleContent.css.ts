import { style } from "@vanilla-extract/css";

import { colors, primitives } from "@/shared/styles";
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

export const root = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
});
export const viewport = style({ overflow: "hidden", position: "relative" });
export const content = style({
  display: "flow-root",
  overflowWrap: "anywhere",
});
export const faded = style({
  selectors: {
    "&::after": {
      left: 0,
      right: 0,
      bottom: 0,
      content: '""',
      height: "48px",
      position: "absolute",
      pointerEvents: "none",
      background: `linear-gradient(transparent, ${colors.background.base})`,
    },
  },
});
