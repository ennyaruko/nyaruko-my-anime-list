import { style } from "@vanilla-extract/css";

import {
  colors,
  primitives,
  typography,
  fixedToContainerLeft,
} from "@/shared/styles";

export const overlay = style({
  inset: 0,
  position: "fixed",
  zIndex: primitives.zIndex.modal,
  background: "rgb(15 23 42 / 68%)",
});

export const content = style({
  border: 0,
  display: "flex",
  outline: "none",
  position: "fixed",
  flexDirection: "column",
  gap: primitives.spacing.m,
  color: colors.text.primary,
  padding: primitives.spacing.xs,
  zIndex: primitives.zIndex.modal,
  background: colors.background.base,
  inset: "env(safe-area-inset-top) 0 env(safe-area-inset-bottom)",
  "@media": {
    "(min-width: 768px)": {
      inset: "50% auto auto 50%",
      height: "min(80dvh, 48rem)",
      padding: primitives.spacing.m,
      borderRadius: primitives.radii.s,
      transform: "translate(-50%, -50%)",
      boxShadow: primitives.shadow.medium,
      width: "min(36rem, calc(100vw - 2rem))",
      border: `1px solid ${colors.border.normal}`,
    },
  },
});

export const heading = style({
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xs,
  justifyContent: "space-between",
});

export const title = style({
  ...typography.heading["m-medium"],
  margin: 0,
});

export const count = style({
  ...typography.caption["2xs"],
  color: colors.text.tertiary,
});

export const selected = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
  padding: primitives.spacing.xxs,
  borderRadius: primitives.radii.s,
  background: colors.background.elevation1,
});

export const selectedLabel = style({
  ...typography.caption["2xs"],
  color: colors.text.tertiary,
});

export const list = style({
  minHeight: 0,
  display: "flex",
  flex: "1 1 auto",
  borderRadius: primitives.radii.s,
  background: colors.background.elevation1,
});

export const listViewport = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
  padding: primitives.spacing.xxs,
});

export const item = style({
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xxs,
  padding: primitives.spacing.xxxs,
  borderRadius: primitives.radii.s,
  selectors: {
    "&[data-selected='true']": {
      background: colors.background.elevation2,
    },
  },
});

export const queueCard = style({
  minWidth: 0,
  flex: "1 1 auto",
});

export const removeButton = style({
  flex: "0 0 auto",
  selectors: {
    "&:focus-visible": { color: colors.text.negative },
    "&:not(:disabled):hover": { color: colors.text.negative },
  },
});

export const removeIcon = style({
  width: "18px",
  height: "18px",
});

export const floatingButton = style([
  fixedToContainerLeft,
  {
    padding: 0,
    width: "44px",
    height: "44px",
    position: "fixed",
    minHeight: "44px",
    overflow: "visible",
    borderRadius: "50%",
    boxShadow: primitives.shadow.xs,
    zIndex: primitives.zIndex.sticky,
    selectors: {
      "&&": { overflow: "visible" },
    },
    bottom: `calc(55px + env(safe-area-inset-bottom) + ${primitives.spacing.xs})`,
  },
]);

export const floatingIcon = style({
  width: "22px",
  height: "22px",
});

export const badge = style({
  top: "-4px",
  right: "-4px",
  height: "20px",
  display: "flex",
  minWidth: "20px",
  position: "absolute",
  alignItems: "center",
  borderRadius: "999px",
  justifyContent: "center",
  background: colors.brand.primary,
  color: colors.text.primaryOnLight,
  padding: `0 ${primitives.spacing.xxxs}`,
  ...typography.caption["2xs"],
});

export const empty = style({
  ...typography.body.s,
  margin: "auto",
  textAlign: "center",
  color: colors.text.tertiary,
});
