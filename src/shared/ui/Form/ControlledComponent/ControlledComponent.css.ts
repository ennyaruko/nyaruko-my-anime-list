import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const error = style({
  color: colors.text.negative,
  marginTop: primitives.spacing.xxxs,
  ...typography.caption.xs,
});
