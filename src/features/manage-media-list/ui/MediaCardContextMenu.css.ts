import { style } from "@vanilla-extract/css";

export const trigger = style({
  minWidth: 0,
  width: "100%",
});

export const cardSurface = style({
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

export const mobileInfoItem = style({
  display: "none",
  "@media": {
    "(max-width: 640px)": { display: "flex" },
  },
});

export const desktopInfoItem = style({
  "@media": {
    "(max-width: 640px)": { display: "none" },
  },
});

export const submenuArrow = style({
  lineHeight: 1,
  fontSize: "18px",
  marginLeft: "auto",
});
