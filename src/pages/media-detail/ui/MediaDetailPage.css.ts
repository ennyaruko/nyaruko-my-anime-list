import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const page = style({
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
});

export const heroSection = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
});

export const section = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xs,
});

export const notFound = style({ minHeight: "50svh" });
