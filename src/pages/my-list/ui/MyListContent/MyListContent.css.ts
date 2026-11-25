import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const foundResult = style({
  ...typography.caption["2xs"],
  color: colors.text.primary,
});

export const resetFilters = style({
  ...typography.caption["2xs"],
  width: "14px",
  height: "14px",
  cursor: "pointer",
});

export const recommendationsLink = style({
  display: "flex",
  alignItems: "center",
  ...typography.caption["2xs"],
  textDecoration: "none",
  color: colors.text.action,
  padding: primitives.spacing.xxs,
  margin: `calc(${primitives.spacing.xxs} * -1)`,
  selectors: {
    "&:hover": { textDecoration: "underline" },
  },
});

export const recommendationsArrow = style({
  width: 16,
  height: 16,
  transform: "rotate(180deg)",
});
