import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  minWidth: 0,
  width: "100%",
  height: "80px",
  display: "flex",
  color: "inherit",
  maxHeight: "80px",
  textDecoration: "none",
  alignItems: "flex-start",
  gap: primitives.spacing.xxs,
});

export const cover = style({
  width: "56px",
  height: "80px",
  flex: "0 0 56px",
  overflow: "hidden",
  position: "relative",
  background: colors.background.neutral2,
});

export const placeholderImage = style({
  top: "50%",
  left: "50%",
  width: "87%",
  height: "62.5%",
  display: "block",
  objectFit: "contain",
  transform: "translate(-50%, -50%)",
});

export const noImageIcon = style({
  width: "16px",
  height: "16px",
  position: "absolute",
  color: colors.text.tertiary,
  top: primitives.spacing.xxxs,
  right: primitives.spacing.xxxs,
});

export const content = style({
  flex: 1,
  minWidth: 0,
  display: "flex",
  alignSelf: "stretch",
  flexDirection: "column",
  justifyContent: "space-between",
});

export const titleBlock = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
});

export const header = style({
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xxs,
  justifyContent: "space-between",
});

export const relationName = style({
  ...typography.caption["2xs"],
  minWidth: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: colors.text.primary,
});

export const title = style({ height: "32px" });

export const footer = style({
  minWidth: 0,
  display: "flex",
  alignItems: "center",
});

export const meta = style({
  ...typography.caption["2xs"],
  minWidth: 0,
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  whiteSpace: "nowrap",
  color: colors.text.secondary,
  gap: primitives.spacing.xxxs,
});

export const separator = style({
  width: "2px",
  height: "2px",
  flex: "0 0 2px",
  borderRadius: "50%",
  background: colors.text.secondary,
});

export const status = style({
  minHeight: "16px",
  padding: `0 ${primitives.spacing.xxxs}`,
});

export const skeletonCover = style({ flex: "0 0 56px" });

export const skeletonContent = style({
  flex: 1,
  minWidth: 0,
  height: "80px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

export const skeletonHeader = style({ width: "70%", height: "14px" });
export const skeletonTitle = style({ width: "100%", height: "32px" });
export const skeletonFooter = style({ width: "55%", height: "13px" });
