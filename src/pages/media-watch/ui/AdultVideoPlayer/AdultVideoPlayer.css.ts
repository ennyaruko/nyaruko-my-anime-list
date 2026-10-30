import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const section = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xs,
});

export const placeholder = style({
  display: "flex",
  minHeight: "220px",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  gap: primitives.spacing.xs,
  color: colors.text.secondary,
  padding: primitives.spacing.l,
  borderRadius: primitives.radii.sm,
  background: `radial-gradient(circle at 50% 35%, ${colors.background.elevation2}, ${colors.background.elevation1} 68%)`,
  ...typography.body.m,
});

export const playMark = style({
  width: "44px",
  height: "44px",
  display: "grid",
  paddingLeft: "3px",
  borderRadius: "50%",
  placeItems: "center",
  background: colors.text.action,
  boxShadow: primitives.shadow.xs,
  color: colors.text.primaryOnLight,
  ...typography.body["s-bold"],
});

export const hint = style({
  maxWidth: "300px",
  color: colors.text.tertiary,
  ...typography.caption.xs,
});
