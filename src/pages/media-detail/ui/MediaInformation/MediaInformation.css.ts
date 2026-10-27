import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const infoRow = style({
  ...typography.body.s,
  alignItems: "baseline",
  color: colors.text.primary,
});

export const infoLabel = style({
  flexShrink: 0,
  color: colors.text.secondary,
});

export const infoValue = style({
  minWidth: 0,
  flexWrap: "wrap",
  alignItems: "center",
  display: "inline-flex",
  gap: primitives.spacing.xxxs,
});

export const releaseDate = style({
  ...typography.caption["2xs"],
  color: colors.text.secondary,
});

export const genreList = style({
  display: "inline",
  color: colors.text.primary,
});

export const genreLink = style({
  textDecoration: "none",
  color: colors.text.action,
  selectors: {
    "&:hover": { textDecoration: "underline" },
  },
});

export const skeletonLines = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
});

export const infoSkeletonLine = style({ width: "72%", height: "16px" });
