import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

const base = style({
  ...typography.caption["2xs"],
  border: 0,
  cursor: "pointer",
  appearance: "none",
  overflow: "hidden",
  alignItems: "center",
  whiteSpace: "nowrap",
  display: "inline-flex",
  textDecoration: "none",
  justifyContent: "center",
  gap: primitives.spacing.tiny,
  selectors: {
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
});

const variants = styleVariants({
  flat: {
    background: "transparent",
    color: colors.text.primary,
  },
  secondary: {
    background: colors.brand.darkBlue,
    color: colors.text.primaryOnLight,
    selectors: {
      "&:not(:disabled):hover": {
        background: colors.brand.darkBlueHover,
      },
      "&:not(:disabled):active": {
        background: colors.brand.darkBluePressed,
      },
    },
  },
  primary: {
    color: colors.text.primary,
    background: colors.background.elevation1,
    selectors: {
      "&:not(:disabled):hover": {
        background: colors.background.elevation1Hover,
      },
      "&:not(:disabled):active": {
        background: colors.background.elevation1Pressed,
      },
    },
  },
});

const sizes = styleVariants({
  l: {
    minHeight: "44px",
    padding: `${primitives.spacing.xxs} ${primitives.spacing.xs}`,
    ...typography.caption.xs,
  },
  s: {
    minHeight: "28px",
    padding: `${primitives.spacing.xxxs} ${primitives.spacing.xxs}`,
    ...typography.caption["2xs"],
  },
});

export const button = style([
  base,
  {
    transition:
      "transform 100ms cubic-bezier(0.2, 0, 0, 1), background-color 100ms cubic-bezier(0.2, 0, 0, 1)",
    "@media": {
      "(hover: hover) and (pointer: fine)": {
        selectors: {
          "&:not(:disabled):active": {
            transform: "scale(0.97)",
          },
        },
      },
    },
  },
]);
export const variant = variants;
export const size = sizes;
export const round = style({
  borderRadius: primitives.radii.s,
});
export const icon = style({
  width: "20px",
  height: "20px",
  flex: "0 0 20px",
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "center",
});
