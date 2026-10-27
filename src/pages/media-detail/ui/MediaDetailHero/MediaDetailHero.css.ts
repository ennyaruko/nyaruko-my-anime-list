import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const backButton = style({
  ...typography.caption["2xs"],
  minHeight: "28px",
  width: "fit-content",
  alignItems: "center",
  display: "inline-flex",
  textDecoration: "none",
  color: colors.text.primary,
  gap: primitives.spacing.xxxs,
});

export const backIcon = style({
  width: "20px",
  height: "20px",
});

export const title = style({
  ...typography.heading["2xl"],
  color: colors.text.primary,
});

export const titleSkeleton = style({
  width: "88%",
  height: "60px",
  marginBottom: primitives.spacing.xs,
});

export const preview = style({
  width: "100%",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  isolation: "isolate",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
  paddingTop: primitives.spacing.xxxs,
  background: colors.background.neutral2,
  selectors: {
    "&::after": {
      inset: 0,
      zIndex: 0,
      content: '""',
      position: "absolute",
      pointerEvents: "none",
      background: "rgba(0, 0, 0, 0.3)",
    },
    "&::before": {
      zIndex: 0,
      content: '""',
      inset: "-3px",
      position: "absolute",
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: `blur(${primitives.blur.sm})`,
      backgroundImage: "var(--banner-image)",
      backgroundColor: colors.background.neutral2,
    },
  },
});

export const hero = style({
  zIndex: 1,
  width: "100%",
  height: "320px",
  display: "flex",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
});

export const previewSkeleton = style({
  width: "100%",
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
  paddingTop: primitives.spacing.xxxs,
  background: colors.background.neutral2,
});

export const heroSkeleton = style({
  width: "100%",
  height: "320px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: colors.background.neutral2,
});

export const posterSkeleton = style({
  maxHeight: "100%",
  aspectRatio: "225 / 320",
  width: "min(225px, 100%)",
  background: colors.background.elevation1,
});

export const posterFrame = style({
  zIndex: 1,
  maxHeight: "100%",
  position: "relative",
  aspectRatio: "225 / 320",
  width: "min(225px, 100%)",
  background: colors.background.neutral2,
});

export const posterImage = style({
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
});

export const posterPlaceholder = style({
  top: "50%",
  left: "50%",
  width: "87%",
  height: "62.5%",
  objectFit: "contain",
  transform: "translate(-50%, -50%)",
});

export const noImageIcon = style({
  position: "absolute",
  top: primitives.spacing.xxs,
  color: colors.text.tertiary,
  right: primitives.spacing.xxs,
});

export const ratingBar = style({
  zIndex: 1,
  minHeight: "34px",
  padding: `0 ${primitives.spacing.xxxs}`,
  background: "rgba(255, 255, 255, 0.85)",
});

export const ratingSkeleton = style({
  zIndex: 1,
  display: "flex",
  minHeight: "34px",
  alignItems: "center",
  gap: primitives.spacing.xxs,
  padding: `0 ${primitives.spacing.xxxs}`,
  background: colors.background.elevation1,
});

export const starSkeleton = style({
  width: "20px",
  height: "20px",
  borderRadius: "50%",
});

export const ratingTextSkeleton = style({ width: "28px", height: "15px" });

export const ratingDisabled = style({ opacity: 0.6, pointerEvents: "none" });

export const ratingValue = style({
  ...typography.heading["m-medium"],
  flexShrink: 0,
  color: colors.text.secondary,
});

export const progress = style({
  maxWidth: "100%",
  background: "transparent",
});

export const menuSkeleton = style({
  width: "200px",
  height: "36px",
  marginTop: primitives.spacing.xxs,
});
