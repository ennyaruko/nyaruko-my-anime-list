import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const page = style({
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
});

export const notFound = style({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: primitives.spacing.xxxl,
  paddingBottom: primitives.spacing.xxxl,
});

export const illustration = style({
  padding: `${primitives.spacing.l} 0`,
});
