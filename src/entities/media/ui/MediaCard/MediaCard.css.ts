import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
});

export const cover = styleVariants({
  l: {
    width: "100%",
    display: "flex",
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    flexDirection: "column",
    aspectRatio: "179 / 256",
    justifyContent: "center",
    background: colors.background.neutral2,
  },
  s: {
    width: "100%",
    display: "flex",
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    flexDirection: "column",
    aspectRatio: "126 / 180",
    justifyContent: "center",
    background: colors.background.neutral2,
  },
});

export const image = style({ inset: 0, position: "absolute" });
export const placeholderImage = style({
  top: "50%",
  left: "50%",
  width: "87%",
  right: "auto",
  bottom: "auto",
  height: "62.5%",
  display: "block",
  objectFit: "contain",
  transform: "translate(-50%, -50%)",
});
export const noImageIcon = style({
  width: "20px",
  height: "20px",
  position: "absolute",
  color: colors.text.tertiary,
  top: primitives.spacing.xxxs,
  right: primitives.spacing.xxxs,
});
export const score = style({
  position: "absolute",
  top: primitives.spacing.xxs,
  left: primitives.spacing.xxxs,
});
export const progress = style({
  left: 0,
  bottom: 0,
  zIndex: 2,
  position: "absolute",
  background: colors.background.neutral1,
});
export const metadata = style({
  ...typography.caption["2xs"],
  flexShrink: 0,
  display: "flex",
  overflow: "hidden",
  whiteSpace: "nowrap",
  color: colors.text.secondary,
  justifyContent: "space-between",
  height: typography.caption["2xs"].lineHeight,
});
export const skeletonCover = styleVariants({
  l: { width: "100%", position: "relative", aspectRatio: "179 / 256" },
  s: { width: "100%", position: "relative", aspectRatio: "126 / 180" },
});
export const skeletonScore = styleVariants({
  l: {
    width: "38px",
    height: "20px",
    position: "absolute",
    top: primitives.spacing.xxs,
    left: primitives.spacing.xxxs,
  },
  s: {
    width: "34px",
    height: "17px",
    position: "absolute",
    top: primitives.spacing.xxs,
    left: primitives.spacing.xxxs,
  },
});
export const skeletonTitle = style({ height: "32px" });
export const skeletonMeta = style({
  display: "flex",
  justifyContent: "space-between",
});
export const skeletonMetaValue = style({ width: "60px", height: "13px" });
