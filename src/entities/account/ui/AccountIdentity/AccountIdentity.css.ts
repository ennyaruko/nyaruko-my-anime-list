import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  minHeight: "36px",
  alignItems: "center",
  gap: primitives.spacing.xxs,
});

export const avatar = style({
  width: "36px",
  flexShrink: 0,
  height: "36px",
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
  background: colors.background.elevation1,
});

export const avatarImage = style({
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
});

export const noImageIcon = style({
  width: "24px",
  height: "24px",
  color: colors.text.tertiary,
});

export const info = style({
  flex: 1,
  minHeight: "36px",
});

export const name = style({
  ...typography.body["s-medium"],
  minWidth: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: colors.text.primary,
});

export const content = style({
  display: "flex",
  minHeight: "15px",
  alignItems: "center",
});

export const skeleton = style({ background: colors.background.elevation1 });
export const avatarSkeleton = style({
  width: "36px",
  flexShrink: 0,
  height: "36px",
  background: colors.background.neutral2,
});
export const infoSkeleton = style({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xs,
});
export const nameSkeleton = style({
  width: "58%",
  height: "13px",
  background: colors.background.neutral2,
});
export const contentSkeleton = style({
  width: "42%",
  height: "11px",
  background: colors.background.neutral2,
});
