import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const descriptionEmpty = style({
  ...typography.body.s,
  margin: 0,
  color: colors.text.primary,
});

export const descriptionSkeleton = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
});

export const descriptionSkeletonLine = style({ height: "16px" });

export const descriptionSkeletonWidth = styleVariants({
  long: { width: "100%" },
  short: { width: "62%" },
  medium: { width: "90%" },
});
