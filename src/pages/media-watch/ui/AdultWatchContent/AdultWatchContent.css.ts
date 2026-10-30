import { style } from "@vanilla-extract/css";

import { typography } from "@/shared/styles";

export const content = style({
  minWidth: 0,
});

export const title = style({
  ...typography.heading["2xl"],
  margin: 0,
  overflowWrap: "anywhere",
});

export const srOnly = style({
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clipPath: "inset(50%)",
});
