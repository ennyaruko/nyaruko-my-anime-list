import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const page = style({
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
});

export const searchIcon = style({
  width: "20px",
  height: "20px",
});
