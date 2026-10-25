import { style, styleVariants } from "@vanilla-extract/css";

import { colors } from "@/shared/styles";

export const root = style({
  width: "40px",
  height: "32px",
  display: "flex",
  flex: "0 0 auto",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
});

export const input = style({
  inset: 0,
  zIndex: 1,
  opacity: 0,
  width: "36px",
  height: "20px",
  margin: "auto",
  cursor: "pointer",
  position: "absolute",
});

export const track = style({
  inset: 0,
  width: "36px",
  height: "20px",
  margin: "auto",
  display: "block",
  position: "absolute",
  borderRadius: "10px",
  background: colors.background.base,
  border: `1px solid ${colors.border.normal}`,
  selectors: {
    [`${input}:disabled ~ &`]: {
      cursor: "not-allowed",
    },
    [`${input}:focus-visible + &`]: {
      outlineOffset: "2px",
      outline: `2px solid ${colors.text.action}`,
    },
  },
});

export const thumb = style({
  top: "50%",
  left: "7px",
  width: "15px",
  height: "15px",
  display: "flex",
  borderRadius: "50%",
  position: "absolute",
  alignItems: "center",
  pointerEvents: "none",
  justifyContent: "center",
  transform: "translate(0, -50%)",
  transition: "transform 180ms ease",
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

export const thumbState = styleVariants({
  unchecked: { transform: "translate(0, -50%)" },
  checked: { transform: "translate(11px, -50%)" },
});
