import { style, keyframes } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

const overlayIn = keyframes({
  to: { opacity: 1 },
  from: { opacity: 0 },
});

const contentIn = keyframes({
  to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
  from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.98)" },
});

export const overlay = style({
  inset: 0,
  position: "fixed",
  background: "rgb(0 0 0 / 55%)",
  zIndex: primitives.zIndex.modal,
  animation: `${overlayIn} 140ms ease-out`,
});

export const content = style({
  top: "50%",
  left: "50%",
  outline: "none",
  position: "fixed",
  boxSizing: "border-box",
  color: colors.text.primary,
  padding: primitives.spacing.l,
  zIndex: primitives.zIndex.modal,
  borderRadius: primitives.radii.md,
  transform: "translate(-50%, -50%)",
  boxShadow: primitives.shadow.popup,
  width: "min(460px, calc(100vw - 32px))",
  background: colors.background.elevation1,
  animation: `${contentIn} 140ms ease-out`,
  border: `1px solid ${colors.border.normal}`,
});

export const title = style({
  ...typography.heading["m-bold"],
  margin: 0,
});

export const description = style({
  ...typography.body.s,
  color: colors.text.secondary,
  margin: `${primitives.spacing.xs} 0 0`,
});

export const actions = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: primitives.spacing.xs,
  marginTop: primitives.spacing.l,
});

export const close = style({
  ...typography.body["s-bold"],
  cursor: "pointer",
  color: colors.text.primary,
  borderRadius: primitives.radii.sm,
  background: colors.background.base,
  border: `1px solid ${colors.border.normal}`,
  padding: `${primitives.spacing.xs} ${primitives.spacing.m}`,
});
