import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const page = style({
  display: "flex",
  flexDirection: "column",
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
  minHeight: "calc(100svh - 55px - env(safe-area-inset-bottom))",
  "@media": {
    "(min-width: 768px)": {
      minHeight: "calc(100svh - 80px - env(safe-area-inset-bottom))",
    },
  },
});
