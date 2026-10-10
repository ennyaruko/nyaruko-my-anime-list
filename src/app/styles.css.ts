import { style, globalStyle } from "@vanilla-extract/css";

import { colors, gradients, primitives, typography } from "@/shared/styles";

globalStyle("body", {
  color: colors.text.primary,
  background: colors.background.base,
  transition: "background-color 160ms ease, color 160ms ease",
});

export const app = style({
  minHeight: "100vh",
  boxSizing: "border-box",
  color: colors.text.primary,
  padding: primitives.spacing.xl,
  background: colors.background.base,
});

export const shell = style({
  margin: "0 auto",
  width: "min(760px, 100%)",
});

export const eyebrow = style({
  ...typography.caption.xs,
  color: colors.text.tertiary,
  marginBottom: primitives.spacing.xs,
});

export const title = style({
  ...typography.heading["3xl-m"],
  margin: 0,
});

export const description = style({
  ...typography.body.s,
  color: colors.text.secondary,
  margin: `${primitives.spacing.xs} 0 0`,
});

export const toolbar = style({
  display: "flex",
  flexWrap: "wrap",
  gap: primitives.spacing.xs,
  marginTop: primitives.spacing.xl,
});

export const button = style({
  ...typography.body["s-bold"],
  cursor: "pointer",
  appearance: "none",
  color: colors.text.primary,
  borderRadius: primitives.radii.sm,
  background: colors.background.elevation1,
  border: `1px solid ${colors.border.normal}`,
  padding: `${primitives.spacing.xs} ${primitives.spacing.m}`,
  ":hover": {
    background: colors.background.elevation1Hover,
  },

  transition:
    "background-color 120ms ease, border-color 120ms ease, transform 120ms ease",

  ":active": {
    transform: "translateY(1px)",
    background: colors.background.elevation1Pressed,
  },
});

export const card = style({
  padding: primitives.spacing.l,
  marginTop: primitives.spacing.xl,
  borderRadius: primitives.radii.md,
  boxShadow: primitives.shadow.small,
  background: colors.background.elevation1,
  border: `1px solid ${colors.border.normal}`,
});

export const cardTitle = style({
  ...typography.heading["m-bold"],
  margin: 0,
});

export const cardText = style({
  ...typography.body.s,
  color: colors.text.secondary,
  margin: `${primitives.spacing.xs} 0 0`,
});

export const fadeDemo = style({
  height: "96px",
  marginTop: primitives.spacing.l,
  borderRadius: primitives.radii.sm,
  background: gradients.backgroundImageFade,
  border: `1px solid ${colors.border.normal}`,
});
