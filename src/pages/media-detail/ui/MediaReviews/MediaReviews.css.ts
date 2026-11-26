import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const divider = style({
  border: `1px solid ${colors.background.elevation1}`,
});

export const emptySection = style({
  ...typography.caption.xs,
  margin: 0,
  color: colors.text.secondary,
});

export const allReviewsLink = style({
  display: "flex",
  alignItems: "center",
  padding: primitives.spacing.xxs,
  margin: `calc(${primitives.spacing.xxs} * -1)`,
  ...typography.caption["2xs"],
  textDecoration: "none",
  color: colors.text.action,
  selectors: { "&:hover": { textDecoration: "underline" } },
});

export const allReviewsLinkArrow = style({
  width: 16,
  height: 16,
  transform: "rotate(180deg)",
});
