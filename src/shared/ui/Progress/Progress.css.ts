import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  width: "100%",
  display: "flex",
  alignItems: "center",
});
export const label = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});
export const size = styleVariants({
  l: { ...typography.body.s, padding: `${primitives.spacing.tiny} 0` },
  m: { ...typography.caption["2xs"], padding: primitives.spacing.xxxs },
  s: { ...typography.caption["2xs"], padding: primitives.spacing.tiny },
});
export const controls = style({
  alignItems: "center",
  display: "inline-flex",
});
export const control = style({
  display: "grid",
  flex: "0 0 auto",
  cursor: "pointer",
  placeItems: "center",
  color: colors.text.action,
  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
      color: colors.text.tertiary,
    },
  },
});
export const controlsSize = styleVariants({
  l: { gap: primitives.spacing.xxs },
  m: { gap: primitives.spacing.xxs },
  s: { gap: primitives.spacing.xxxs },
});
export const controlSize = styleVariants({
  s: { width: "14px", height: "14px" },
  l: { width: "20px", height: "20px" },
  m: { width: "16px", height: "16px" },
});
export const controlIcon = style({
  width: "100%",
  height: "100%",
  color: "inherit",
});
