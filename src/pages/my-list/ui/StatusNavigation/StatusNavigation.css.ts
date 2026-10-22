import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  rowGap: primitives.spacing.xxs,
  columnGap: primitives.spacing.xxxs,
  ...typography.caption["2xs"],
});

export const item = style({
  display: "inline-flex",
  gap: primitives.spacing.xxxs,
});

const buttonBase = {
  font: "inherit",
  cursor: "pointer",
};

export const button = styleVariants({
  default: {
    textDecoration: "none",
    color: colors.text.action,
    ...buttonBase,
  },
  active: {
    color: colors.text.negative,
    textDecoration: "underline",
    ...buttonBase,
  },
});

export const separator = style({
  color: colors.text.secondary,
});
