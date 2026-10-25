import { style } from "@vanilla-extract/css";

export const root = style({
  minHeight: "100svh",
  paddingBottom: "calc(55px + env(safe-area-inset-bottom))",
});
