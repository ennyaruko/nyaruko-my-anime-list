import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

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
      width: "min(64rem, calc(100vw - 2rem))",
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

export const entries = style({
  minHeight: 0,
  display: "flex",
  flex: "1 1 auto",
  borderRadius: primitives.radii.s,
  background: colors.background.elevation1,
});

export const entriesViewport = style({
  padding: primitives.spacing.xxs,
});

export const entry = style({
  display: "grid",
  alignItems: "start",
  gap: primitives.spacing.xxs,
  gridTemplateColumns: "auto 1fr",
  padding: primitives.spacing.xxxs,
  borderBottom: `1px solid ${colors.border.normal}`,
});

export const timestamp = style({
  ...typography.caption["2xs"],
  whiteSpace: "nowrap",
  color: colors.text.tertiary,
});

export const message = style({
  ...typography.caption["2xs"],
  margin: 0,
  whiteSpace: "pre-wrap",
  fontFamily: "monospace",
  overflowWrap: "anywhere",
});

export const level = styleVariants({
  info: { color: colors.text.action },
  log: { color: colors.text.primary },
  warn: { color: colors.status.warning },
  error: { color: colors.status.negative },
});

export const empty = style({
  ...typography.body.s,
  margin: "auto",
  textAlign: "center",
  color: colors.text.tertiary,
});
