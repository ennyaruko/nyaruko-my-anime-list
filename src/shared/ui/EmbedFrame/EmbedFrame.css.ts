import { style } from "@vanilla-extract/css";

export const frame = style({
  border: 0,
  width: "100%",
  height: "100%",
  display: "block",
  maxWidth: "100%",
  background: "#000",
});
export const container = style({
  width: "100%",
  background: "#000",
  marginInline: "auto",
  aspectRatio: "16 / 9",
});
