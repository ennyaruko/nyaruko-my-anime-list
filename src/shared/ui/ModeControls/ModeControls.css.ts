import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({ display: "flex", gap: primitives.spacing.xxxs });
export const button = style({
  ...typography.caption["2xs"],
  border: 0,
  cursor: "pointer",
  color: colors.text.action,
  background: "transparent",
  selectors: { "&:hover": { textDecoration: "underline" } },
});
export const active = style({
  color: colors.text.negative,
  textDecoration: "underline",
});
export const separator = style({
  ...typography.caption["2xs"],
  color: colors.text.tertiary,
});
