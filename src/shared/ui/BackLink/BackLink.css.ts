import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  ...typography.caption["2xs"],
  minHeight: "28px",
  width: "fit-content",
  alignItems: "center",
  display: "inline-flex",
  textDecoration: "none",
  color: colors.text.primary,
  gap: primitives.spacing.xxxs,
});

export const icon = style({
  width: "20px",
  height: "20px",
});
