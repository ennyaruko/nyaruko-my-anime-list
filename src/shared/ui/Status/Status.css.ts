import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  borderRadius: "5px",
  alignItems: "center",
  whiteSpace: "nowrap",
  display: "inline-flex",
  justifyContent: "center",
  padding: `${primitives.spacing.tiny} ${primitives.spacing.xxs}`,
});

export const variant = styleVariants({
  info: { background: colors.status.info, color: colors.text.primaryOnLight },
  positive: {
    color: colors.text.primaryOnLight,
    background: colors.status.positive,
  },
  negative: {
    color: colors.text.primaryOnLight,
    background: colors.status.negative,
  },
});

export const size = styleVariants({
  m: { ...typography.body["s-bold"] },
  s: { ...typography.body["2xs-bold"] },
});
