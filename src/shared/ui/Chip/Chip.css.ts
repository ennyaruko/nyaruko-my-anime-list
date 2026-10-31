import { style, globalStyle, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  alignItems: "center",
  display: "inline-flex",
  color: colors.text.tertiary,
  gap: primitives.spacing.xxxs,
});

export const label = style({
  ...typography.caption["2xs-medium"],
  whiteSpace: "nowrap",
});

export const icon = style({
  flex: "none",
  display: "block",
});

export const iconSize = styleVariants({
  l: { width: "24px", height: "24px" },
  m: { width: "20px", height: "20px" },
  s: { width: "14px", height: "14px" },
});

globalStyle(`${icon} path`, {
  fill: colors.text.tertiary,
});
