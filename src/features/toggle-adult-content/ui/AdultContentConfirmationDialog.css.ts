import { style } from "@vanilla-extract/css";

import { themeVars, primitives, typography } from "@/shared/styles";

export const overlay = style({
  inset: 0,
  position: "fixed",
  zIndex: primitives.zIndex.modal,
  background: "rgb(15 23 42 / 58%)",
});

export const content = style({
  border: 0,
  top: "50%",
  left: "50%",
  display: "flex",
  outline: "none",
  position: "fixed",
  overflowY: "auto",
  flexDirection: "column",
  gap: primitives.spacing.xs,
  padding: primitives.spacing.l,
  zIndex: primitives.zIndex.modal,
  maxHeight: "calc(100dvh - 2rem)",
  borderRadius: primitives.radii.s,
  transform: "translate(-50%, -50%)",
  color: themeVars.color.text.primary,
  boxShadow: primitives.shadow.medium,
  width: "min(28rem, calc(100vw - 2rem))",
  background: themeVars.color.background.base,
});

export const title = style({
  ...typography.heading["m-medium"],
  margin: 0,
});

export const description = style({
  ...typography.body.s,
  margin: 0,
  color: themeVars.color.text.secondary,
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: primitives.spacing.xxs,
  marginTop: primitives.spacing.xs,
});
