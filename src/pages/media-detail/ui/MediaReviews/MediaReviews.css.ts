import { style } from "@vanilla-extract/css";

import { colors, typography } from "@/shared/styles";

export const divider = style({
  border: `1px solid ${colors.background.elevation1}`,
});

export const emptySection = style({
  ...typography.caption.xs,
  margin: 0,
  color: colors.text.secondary,
});
