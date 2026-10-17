import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const root = style({
  width: "100%",
  padding: `0 ${primitives.spacing.xs}`,
});
