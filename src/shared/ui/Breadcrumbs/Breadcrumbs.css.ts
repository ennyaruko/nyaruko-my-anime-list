import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  minHeight: "20px",
});
export const list = style({
  margin: 0,
  padding: 0,
  display: "flex",
  flexWrap: "wrap",
  listStyle: "none",
  alignItems: "center",
  columnGap: primitives.spacing.xxxs,
});
export const item = style({
  alignItems: "center",
  display: "inline-flex",
  gap: primitives.spacing.xxxs,
});
export const link = style({
  ...typography.caption["2xs"],
  textDecoration: "none",
  color: colors.text.secondary,
});
export const active = style({
  ...typography.caption["2xs-medium"],
});
export const separator = style({
  ...typography.caption["2xs"],
  color: colors.text.secondary,
});
