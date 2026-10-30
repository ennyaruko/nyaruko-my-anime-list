import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  minHeight: "36px",
  alignItems: "center",
  position: "relative",
  gap: primitives.spacing.xxs,
  padding: `${primitives.spacing.xxs} ${primitives.spacing.xxs} ${primitives.spacing.xxs} ${primitives.spacing.s}`,
  selectors: {
    "&::before": {
      top: 0,
      left: 0,
      bottom: 0,
      width: "4px",
      content: '""',
      position: "absolute",
    },
  },
});

export const variant = styleVariants({
  info: {
    color: colors.text.info,
    background: colors.background.elevation1Info,
    selectors: { "&::before": { background: colors.text.info } },
  },
  neutral: {
    color: colors.text.secondary,
    background: colors.background.elevation1,
    selectors: { "&::before": { background: colors.text.secondary } },
  },
  warning: {
    color: colors.text.warning,
    background: colors.background.elevation1Warning,
    selectors: { "&::before": { background: colors.text.warning } },
  },
  feature: {
    color: colors.text.feature,
    background: colors.background.elevation1Feature,
    selectors: { "&::before": { background: colors.text.feature } },
  },
  positive: {
    color: colors.text.positive,
    background: colors.background.elevation1Positive,
    selectors: { "&::before": { background: colors.text.positive } },
  },
  negative: {
    color: colors.text.negative,
    background: colors.background.elevation1Negative,
    selectors: { "&::before": { background: colors.text.negative } },
  },
});

export const size = styleVariants({
  s: { ...typography.heading["s-medium"] },
  m: { ...typography.heading["m-medium"] },
});

export const action = style({
  flex: "none",
  marginLeft: "auto",
  alignItems: "center",
  display: "inline-flex",
});
