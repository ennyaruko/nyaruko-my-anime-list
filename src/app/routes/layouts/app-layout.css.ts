import { style } from "@vanilla-extract/css";

export const root = style({
  minHeight: "100svh",
  paddingBottom: "calc(55px + env(safe-area-inset-bottom))",
  "@media": {
    "(min-width: 768px)": {
      paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
    },
  },
});
