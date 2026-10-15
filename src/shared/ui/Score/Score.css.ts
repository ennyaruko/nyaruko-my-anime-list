import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const score = style({
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "center",
  borderRadius: primitives.radii.s,
});
export const scoreVariant = styleVariants({
  warning: {
    background: colors.status.warning,
    color: colors.text.primaryOnLight,
  },
  negative: {
    color: colors.text.primaryOnLight,
    background: colors.status.negative,
  },
  positive: {
    color: colors.text.primaryOnLight,
    background: colors.status.positive,
  },
});
export const scoreSize = styleVariants({
  m: { width: "38px", height: "20px", ...typography.body["s-bold"] },
  s: { width: "34px", height: "17px", ...typography.body["2xs-bold"] },
});
export const shadow = style({ boxShadow: primitives.shadow.xs });
