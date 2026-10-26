import { style } from "@vanilla-extract/css";

export const trigger = style({
  minWidth: 0,
  width: "100%",
  position: "relative",
});

export const mediaLink = style({
  inset: 0,
  zIndex: 1,
  cursor: "pointer",
  position: "absolute",
});

export const icon = style({
  width: "16px",
  flexShrink: 0,
  height: "16px",
});
