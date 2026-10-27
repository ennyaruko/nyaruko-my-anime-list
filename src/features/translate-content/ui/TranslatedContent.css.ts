import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const status = style({
  ...typography.caption["2xs"],
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: primitives.spacing.xxs,
  color: colors.text.secondary,
});
