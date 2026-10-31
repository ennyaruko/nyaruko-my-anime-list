import { style } from "@vanilla-extract/css";

import { typography } from "@/shared/styles";

export const title = style({
  ...typography.heading["2xl"],
  margin: 0,
  overflowWrap: "anywhere",
});
