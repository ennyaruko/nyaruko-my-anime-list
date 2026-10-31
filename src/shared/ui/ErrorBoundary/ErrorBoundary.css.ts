import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  width: "100%",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
});

export const size = styleVariants({
  m: { padding: `${primitives.spacing.s} 0` },
  l: { padding: `${primitives.spacing.xxxl} 0` },
});

export const illustration = style({
  width: "100%",
  objectFit: "contain",
});

export const illustrationSize = styleVariants({
  m: { maxWidth: "210px" },
  l: { maxWidth: "270px" },
});

export const title = style({
  ...typography.body["s-medium"],
  color: colors.text.primary,
});

export const description = style({
  ...typography.caption["2xs"],
  maxWidth: "250px",
  color: colors.text.tertiary,
});

export const globalErrorFallback = style({
  width: "100%",
  display: "flex",
  minHeight: "100svh",
  flexDirection: "column",
  padding: primitives.spacing.s,
});

export const content = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: primitives.spacing.xl,
});
