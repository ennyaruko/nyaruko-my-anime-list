import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const statisticsLink = style({
  display: "flex",
  alignItems: "center",
  padding: primitives.spacing.xxs,
  margin: `calc(${primitives.spacing.xxs} * -1)`,
  ...typography.caption["2xs"],
  textDecoration: "none",
  color: colors.text.action,
  selectors: {
    "&:hover": { textDecoration: "underline" },
  },
});

export const statisticsLinkArrow = style({
  width: 16,
  height: 16,
  transform: "rotate(180deg)",
});
