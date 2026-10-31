import { style } from "@vanilla-extract/css";

import { colors } from "../../styles";

export const root = style({
  minWidth: 0,
  minHeight: 0,
  width: "100%",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  maxHeight: "inherit",
  flexDirection: "column",
});

export const viewport = style({
  minWidth: 0,
  minHeight: 0,
  width: "100%",
  height: "100%",
  flex: "1 1 auto",
  maxHeight: "inherit",
});

export const scrollbar = style({
  top: 0,
  right: 0,
  bottom: 0,
  opacity: 0,

  width: "8px",
  padding: "2px",
  display: "flex",

  cursor: "pointer",
  userSelect: "none",
  touchAction: "none",
  position: "absolute",

  pointerEvents: "none",
  background: "transparent",
  transition: "opacity 140ms ease",

  selectors: {
    [`${root}:hover &`]: {
      opacity: 1,
      pointerEvents: "auto",
    },
  },
});

export const thumb = style({
  flex: 1,
  borderRadius: "999px",
  background: colors.text.tertiary,
});
