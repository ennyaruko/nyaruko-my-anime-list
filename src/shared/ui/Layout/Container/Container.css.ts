import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const root = style({
  width: "100%",
  margin: "0 auto",
  maxWidth: "880px",
  padding: `0 ${primitives.spacing.xs}`,
  "@media": {
    "(min-width: 1024px)": {
      // width: "min(100%, 1280px)",
      padding: `0 ${primitives.spacing.xl}`,
    },
    "(min-width: 640px) and (max-width: 1023px)": {
      // width: "min(100%, 960px)",
      padding: `0 ${primitives.spacing.l}`,
    },
  },
});
