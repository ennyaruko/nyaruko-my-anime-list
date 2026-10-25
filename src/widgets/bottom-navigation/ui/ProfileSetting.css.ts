import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  width: "100%",
  height: "32px",
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  gap: primitives.spacing.xxs,
});

export const label = style({
  ...typography.body.s,
  color: colors.text.primary,
});
