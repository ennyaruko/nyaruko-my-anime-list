import { style } from "@vanilla-extract/css";

import {
  colors,
  primitives,
  typography,
  fixedToContainerLeft,
} from "@/shared/styles";

export const trigger = style([
  fixedToContainerLeft,
  {
    padding: 0,
    width: "44px",
    height: "44px",
    minHeight: "44px",
    position: "fixed",
    borderRadius: "50%",
    boxShadow: primitives.shadow.xs,
    zIndex: primitives.zIndex.sticky,
    selectors: {
      "&&": { overflow: "visible" },
    },
    bottom: `calc(55px + env(safe-area-inset-bottom) + ${primitives.spacing.xs})`,
  },
]);

export const content = style({
  display: "flex",
  boxSizing: "border-box",
  flexDirection: "column",
  gap: primitives.spacing.xs,
  padding: primitives.spacing.xxs,
  zIndex: primitives.zIndex.popover,
  boxShadow: primitives.shadow.popup,
  background: colors.background.base,
  width: "min(260px, calc(100vw - 24px))",
  border: `1px solid ${colors.border.normal}`,
});

export const heading = style({
  ...typography.heading["s-medium"],
  color: colors.text.primary,
  padding: `${primitives.spacing.xxs} 0`,
  marginTop: `0 ${primitives.spacing.xxxs}`,
});

export const action = style({
  width: "100%",
});

export const clearButton = style({
  padding: 0,
  width: "32px",
  minHeight: "32px",
  selectors: {
    "&:focus-visible": { color: colors.text.negative },
    "&:not(:disabled):hover": { color: colors.text.negative },
  },
});

export const clearIcon = style({
  width: "16px",
  height: "16px",
});

export const triggerIcon = style({
  width: "22px",
  height: "22px",
});

export const saved = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
  padding: primitives.spacing.xxs,
  marginTop: primitives.spacing.xxxs,
  background: colors.background.elevation1,
});

export const savedLabel = style({
  ...typography.caption["2xs-medium"],
  color: colors.text.tertiary,
});

export const caption = style({
  ...typography.caption["2xs"],
  color: colors.text.secondary,
});

export const empty = style({
  ...typography.caption.xs,
  textAlign: "center",
  color: colors.text.tertiary,
  padding: `${primitives.spacing.xxs}0`,
});
