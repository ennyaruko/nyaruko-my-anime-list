import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const relations = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxs,
});

export const relationSkeletonList = style({
  display: "flex",
  flexDirection: "column",
});
