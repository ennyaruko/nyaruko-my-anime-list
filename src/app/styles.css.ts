import { style, globalStyle } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

globalStyle("body", {
  margin: 0,
  color: colors.text.primary,
  fontFamily: "Inter, sans-serif",
  background: colors.background.base,
  transition: "background-color 160ms ease, color 160ms ease",
});

globalStyle("button, input", { font: "inherit" });

export const app = style({
  padding: "32px",
  minHeight: "100vh",
  boxSizing: "border-box",
  color: colors.text.primary,
  background: colors.background.base,
  "@media": {
    "(max-width: 640px)": { padding: "20px 14px" },
  },
});

export const header = style({
  display: "flex",
  maxWidth: "1440px",
  margin: "0 auto 24px",
  alignItems: "flex-start",
  gap: primitives.spacing.l,
  justifyContent: "space-between",
  "@media": {
    "(max-width: 600px)": {
      flexDirection: "column",
      gap: primitives.spacing.m,
    },
  },
});

export const eyebrow = style({
  ...typography.caption.xs,
  letterSpacing: "0.08em",
  color: colors.text.tertiary,
  marginBottom: primitives.spacing.xs,
});

export const title = style({
  ...typography.heading["3xl-medium"],
  margin: 0,
});

export const description = style({
  ...typography.body.s,
  color: colors.text.secondary,
  margin: `${primitives.spacing.xs} 0 0`,
});

export const themeSwitch = style({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xxs,
});

export const gallery = style({
  display: "flex",
  margin: "0 auto",
  maxWidth: "1440px",
  flexDirection: "column",
  gap: primitives.spacing.m,
});

export const section = style({
  minWidth: 0,
  boxSizing: "border-box",
  padding: primitives.spacing.l,
  borderRadius: primitives.radii.sm,
  border: `1px solid ${colors.border.normal}`,
  "@media": {
    "(max-width: 640px)": { padding: primitives.spacing.s },
  },
});

export const sectionTitle = style({
  ...typography.heading["m-medium"],
  margin: `0 0 ${primitives.spacing.m}`,
});

export const samples = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "start",
  gap: primitives.spacing.m,
});

export const sample = style({
  minWidth: 0,
  display: "flex",
  alignItems: "stretch",
  boxSizing: "border-box",
  flexDirection: "column",
  gap: primitives.spacing.xs,
  padding: primitives.spacing.s,
  borderRadius: primitives.radii.sm,
  border: `1px solid ${colors.border.normal}`,
});

export const sampleLabel = style({
  ...typography.caption["2xs-medium"],
  color: colors.text.tertiary,
});

export const sampleBody = style({
  minWidth: 0,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: primitives.spacing.xs,
});

globalStyle(`${sampleBody} > input`, { minWidth: 0, flex: "1 1 180px" });

export const column = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xs,
});

export const row = style({
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xs,
});
