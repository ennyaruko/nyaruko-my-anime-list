import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const overlay = style({
  inset: 0,
  position: "fixed",
  zIndex: primitives.zIndex.modal,
  background: "rgb(15 23 42 / 68%)",
});

export const content = style({
  display: "flex",
  outline: "none",
  position: "fixed",
  overflowY: "auto",
  flexDirection: "column",
  gap: primitives.spacing.xs,
  color: colors.text.primary,
  inset: "50% auto auto 50%",
  padding: primitives.spacing.l,
  zIndex: primitives.zIndex.modal,
  borderRadius: primitives.radii.s,
  background: colors.background.base,
  transform: "translate(-50%, -50%)",
  boxShadow: primitives.shadow.medium,
  width: "min(28rem, calc(100vw - 2rem))",
  border: `1px solid ${colors.border.normal}`,
  maxHeight:
    "calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 2rem)",
});

export const title = style({
  ...typography.heading["m-medium"],
  margin: 0,
});

export const description = style({
  ...typography.body.s,
  margin: 0,
  color: colors.text.secondary,
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: primitives.spacing.xxs,
  marginTop: primitives.spacing.xs,
});
