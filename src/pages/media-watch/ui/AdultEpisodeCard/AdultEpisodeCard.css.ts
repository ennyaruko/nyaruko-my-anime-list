import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const card = style({
  border: 0,
  padding: 0,
  width: "100%",
  display: "flex",
  color: "inherit",
  cursor: "pointer",
  textAlign: "left",
  flexDirection: "column",
  background: "transparent",
  gap: primitives.spacing.xxs,
  transition: "opacity 160ms ease",
});

export const dimmed = style({ opacity: 0.5 });

export const cover = style({
  width: "100%",
  display: "block",
  overflow: "hidden",
  position: "relative",
  aspectRatio: "179 / 256",
  background: colors.background.elevation1,
});

export const coverImage = style({
  inset: 0,
  position: "absolute",
});

export const score = style({
  position: "absolute",
  top: primitives.spacing.xxs,
  left: primitives.spacing.xxs,
});

export const title = style({
  ...typography.body["s-medium"],
  minHeight: "2.5em",
  overflow: "hidden",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  overflowWrap: "anywhere",
  color: colors.text.action,
  WebkitBoxOrient: "vertical",
});
