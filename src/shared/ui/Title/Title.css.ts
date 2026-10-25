import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  minWidth: 0,
  width: "100%",
  flexShrink: 0,
  height: "32px",
  display: "flex",
  maxWidth: "100%",
  alignItems: "flex-start",
  gap: primitives.spacing.tiny,
});
export const text = style({
  ...typography.heading["s-medium"],
  minWidth: 0,
  overflow: "hidden",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  color: colors.text.action,
  WebkitBoxOrient: "vertical",
});
export const marker = style({
  width: "10px",
  height: "10px",
  flex: "0 0 10px",
  marginTop: "2px",
  borderRadius: "50%",
  marginRight: primitives.spacing.xxxs,
});
export const state = styleVariants({
  default: { background: "transparent" },
  watching: { background: colors.text.info },
  paused: { background: colors.text.tertiary },
  planning: { background: colors.text.warning },
  dropped: { background: colors.text.negative },
  completed: { background: colors.text.positive },
});
