import { style, keyframes } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

const watchShimmer = keyframes({
  "0%": { transform: "translateX(-150%) skewX(-18deg)" },
  "100%": { transform: "translateX(350%) skewX(-18deg)" },
});

export const watchLink = style({
  display: "flex",
  minHeight: "80px",
  overflow: "hidden",
  position: "relative",
  isolation: "isolate",
  alignItems: "center",
  borderRadius: "11px",
  textDecoration: "none",
  gap: primitives.spacing.xs,
  color: colors.text.primaryOnLight,
  boxShadow: "0 4px 10px rgb(20 58 100 / 22%)",
  padding: `${primitives.spacing.xxs} ${primitives.spacing.xs}`,
  transition:
    "transform 160ms cubic-bezier(0.2, 0, 0, 1), box-shadow 160ms cubic-bezier(0.2, 0, 0, 1)",
  background: `linear-gradient(110deg, ${colors.table.state1} 0%, ${colors.table.state2} 52%, ${colors.table.state3} 100%)`,
  "@media": {
    "(min-width: 768px)": { maxWidth: "560px" },
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
      selectors: {
        "&:hover": { transform: "none" },
        "&::before": { display: "none" },
        "&:active": { transform: "none" },
      },
    },
  },
  selectors: {
    "&:focus-visible": {
      outlineOffset: "3px",
      outline: `2px solid ${colors.text.action}`,
    },
    "&:active": {
      transform: "translateY(1px)",
      boxShadow: "0 2px 5px rgb(20 58 100 / 24%)",
    },
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 7px 15px rgb(20 58 100 / 30%)",
    },
    "&:hover::before, &:focus-visible::before": {
      animation: `${watchShimmer} 1.2s ease-out 1 both`,
    },
    "&::before": {
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 0,
      width: "42%",
      content: '""',
      position: "absolute",
      pointerEvents: "none",
      transform: "translateX(-150%) skewX(-18deg)",
      background:
        "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 5%) 18%, rgb(255 255 255 / 48%) 50%, rgb(255 255 255 / 5%) 82%, transparent 100%)",
    },
  },
});

export const watchPlayIcon = style({
  zIndex: 1,
  width: "48px",
  height: "48px",
  display: "grid",
  flex: "0 0 48px",
  borderRadius: "50%",
  position: "relative",
  placeItems: "center",
  background: "rgb(255 255 255 / 20%)",
  border: "1px solid rgb(255 255 255 / 30%)",
});

export const watchText = style({
  zIndex: 1,
  minWidth: 0,
  display: "flex",
  flex: "1 1 auto",
  position: "relative",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
});

export const watchTitle = style({
  ...typography.heading["m-bold"],
  fontWeight: "700",
  color: colors.text.primaryOnLight,
});

export const watchEpisodes = style({
  ...typography.body.s,
  color: colors.text.primaryOnLight,
});

export const watchArrow = style({
  ...typography.heading["xl-medium"],
  zIndex: 1,
  marginLeft: "auto",
  position: "relative",
  color: colors.text.primaryOnLight,
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
  "@media": {
    "(min-width: 1024px)": { height: "380px" },
  },
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
  "@media": {
    "(min-width: 1024px)": { width: "min(267px, 100%)" },
  },
});

export const posterFrame = style({
  zIndex: 1,
  maxHeight: "100%",
  position: "relative",
  aspectRatio: "225 / 320",
  width: "min(225px, 100%)",
  background: colors.background.neutral2,
  "@media": {
    "(min-width: 1024px)": { width: "min(267px, 100%)" },
  },
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
  background: colors.background.neutral1,
  padding: `0 ${primitives.spacing.xxxs}`,
});

export const ratingBarContent = style({
  zIndex: 1,
  minHeight: "34px",
  maxWidth: "420px",
  padding: `0 ${primitives.spacing.xxxs}`,
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
