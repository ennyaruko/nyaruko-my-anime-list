import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  ...typography.body.s,
  alignItems: "center",
  display: "inline-flex",
  gap: primitives.spacing.xxs,
  color: colors.text.secondary,
});

export const select = style({
  ...typography.body.s,
  minHeight: "36px",
  cursor: "pointer",
  color: colors.text.primary,
  borderRadius: primitives.radii.s,
  background: colors.background.base,
  padding: `0 ${primitives.spacing.xxs}`,
  border: `1px solid ${colors.border.secondary}`,
  selectors: {
    "&:focus-visible": {
      outlineOffset: "2px",
      outline: `2px solid ${colors.text.action}`,
    },
  },
});
