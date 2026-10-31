import { style, globalStyle, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const wrapper = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  color: colors.text.primary,
  gap: primitives.spacing.xxs,
  background: colors.background.base,
  padding: `0 ${primitives.spacing.xs}`,
  selectors: {
    "&:has(input:disabled)": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&:focus-within": {
      outline: `1px solid ${colors.border.secondaryHover}`,
    },
  },
});

export const size = styleVariants({
  l: {
    height: "50px",
    ...typography.body.s,
    paddingLeft: primitives.spacing.xs,
    paddingRight: primitives.spacing.xs,
  },
  m: {
    height: "36px",
    ...typography.body.s,
    paddingLeft: primitives.spacing.xxs,
    paddingRight: primitives.spacing.xxs,
  },
});

export const variant = styleVariants({
  default: { background: colors.background.base },
  grayscale: { background: colors.background.elevation1 },
});

export const round = style({ borderRadius: primitives.radii.sm });
export const shadow = style({ boxShadow: primitives.shadow.medium });

export const input = style({
  minWidth: 0,
  width: "100%",
  height: "100%",
  outline: "none",
  flex: "1 1 auto",
  color: "inherit",
  appearance: "none",
  selectors: {
    "&:disabled": { cursor: "not-allowed" },
    "&::placeholder": { opacity: 1, color: colors.text.secondary },
  },
});

export const slot = style({
  width: "20px",
  height: "20px",
  flex: "0 0 auto",
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "center",
  color: colors.text.secondary,
  selectors: {
    [`${wrapper}:focus-within &`]: {
      color: colors.text.primary,
    },
  },
});

globalStyle(`${slot} svg`, {
  width: "100%",
  height: "100%",
});

export const clearButton = style({
  width: "20px",
  height: "20px",
  display: "grid",
  flex: "0 0 auto",
  cursor: "pointer",
  placeItems: "center",
  color: colors.text.action,
});

export const clearIcon = style({ width: "16px", height: "16px" });
