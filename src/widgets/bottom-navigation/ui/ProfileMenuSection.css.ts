import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
});

export const title = style({
  ...typography.caption["2xs-medium"],
  color: colors.text.tertiary,
});
