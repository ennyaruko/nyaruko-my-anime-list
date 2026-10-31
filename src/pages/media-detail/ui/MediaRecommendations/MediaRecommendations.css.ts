import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const recommendationCard = style({
  minWidth: 0,
  display: "flex",
  position: "relative",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
});

export const recommendationLink = style({
  inset: 0,
  zIndex: 1,
  cursor: "pointer",
  position: "absolute",
});

export const recommendationCover = style({
  width: "100%",
  overflow: "hidden",
  position: "relative",
  aspectRatio: "126 / 180",
  background: colors.background.neutral2,
});

export const recommendationPlaceholder = style({
  top: "50%",
  left: "50%",
  width: "87%",
  height: "62.5%",
  objectFit: "contain",
  transform: "translate(-50%, -50%)",
});

export const noImageIcon = style({
  width: "20px",
  height: "20px",
  position: "absolute",
  top: primitives.spacing.xxs,
  color: colors.text.tertiary,
  right: primitives.spacing.xxs,
});

export const recommendationScore = style({
  zIndex: 2,
  position: "absolute",
  pointerEvents: "none",
  top: primitives.spacing.xxs,
  left: primitives.spacing.xxxs,
});

export const recommendationProgress = style({
  left: 0,
  bottom: 0,
  zIndex: 2,
  position: "absolute",
  pointerEvents: "auto",
  background: colors.background.neutral1,
});

export const recommendationTitle = style({ height: "32px" });

export const recommendationMeta = style({
  ...typography.caption["2xs"],
  minWidth: 0,
  display: "flex",
  overflow: "hidden",
  whiteSpace: "nowrap",
  gap: primitives.spacing.xxxs,
  color: colors.text.secondary,
  justifyContent: "space-between",
});

export const recommendationCoverSkeleton = style({
  width: "100%",
  aspectRatio: "126 / 180",
});

export const recommendationTitleSkeleton = style({
  width: "100%",
  height: "32px",
});

export const recommendationMetaSkeleton = style({
  width: "100%",
  height: "13px",
});

export const allRecommendationsLink = style({
  ...typography.caption["2xs"],
  textDecoration: "none",
  color: colors.text.action,
  selectors: {
    "&:hover": { textDecoration: "underline" },
  },
});
