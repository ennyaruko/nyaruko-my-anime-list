import { style } from "@vanilla-extract/css";

import { colors } from "@/shared/styles";

export const root = style({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  background: colors.background.neutral2,
});

export const image = style({
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
  position: "relative",
});

export const previewImage = style({
  filter: "blur(2px)",
  transform: "scale(1.02)",
});

export const loading = style({
  inset: 0,
  position: "absolute",
});
