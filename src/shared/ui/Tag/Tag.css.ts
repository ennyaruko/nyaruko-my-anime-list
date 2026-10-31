import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const tag = styleVariants({
  m: { ...typography.body.s },
  s: { ...typography.caption["2xs"] },
});
export const list = style({
  rowGap: "8px",
  display: "flex",
  flexWrap: "wrap",
  alignContent: "center",
  columnGap: primitives.spacing.xxxs,
});
export const text = style({
  textDecoration: "none",
  color: colors.text.action,
});
export const button = style({
  border: 0,
  textAlign: "left",
  cursor: "pointer",
  appearance: "none",
});
