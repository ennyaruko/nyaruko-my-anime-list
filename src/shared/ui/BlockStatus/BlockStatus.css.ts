import { style, globalStyle } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  width: "min(100%, 250px)",
  gap: primitives.spacing.s,
  padding: `${primitives.spacing.xxxl} 0`,
});

export const icon = style({
  width: "100%",
  flex: "0 0 auto",
});

globalStyle(`${icon} > svg`, {
  width: "100%",
  height: "auto",
  display: "block",
});

export const title = style({
  ...typography.heading["m-medium"],
  color: colors.text.primary,
});

export const description = style({
  ...typography.caption["2xs"],
  color: colors.text.tertiary,
});
