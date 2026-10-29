import { style, styleVariants } from "@vanilla-extract/css";

import { colors, typography } from "../../styles";

export const root = style({
  minWidth: 0,
  width: "100%",
  flexShrink: 0,
  height: "32px",
  display: "block",
  maxWidth: "100%",
  position: "relative",
});
export const text = style({
  ...typography.heading["s-medium"],
  minWidth: 0,
  width: "100%",
  overflow: "hidden",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  color: colors.text.action,
  WebkitBoxOrient: "vertical",
});
export const textWithMarker = style({ textIndent: "14px" });
export const marker = style({
  left: 0,
  top: "2px",
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  position: "absolute",
});
export const state = styleVariants({
  default: { background: "transparent" },
  watching: { background: colors.text.info },
  paused: { background: colors.text.tertiary },
  planning: { background: colors.text.warning },
  dropped: { background: colors.text.negative },
  repeating: { background: colors.text.feature },
  completed: { background: colors.text.positive },
});
