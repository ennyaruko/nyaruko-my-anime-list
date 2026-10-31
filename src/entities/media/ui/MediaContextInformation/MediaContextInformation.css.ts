import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../../../shared/styles";

export const root = style({
  width: "100%",
  display: "flex",
  maxWidth: "100%",
  whiteSpace: "normal",
  boxSizing: "border-box",
  flexDirection: "column",
  overflowWrap: "anywhere",
  gap: primitives.spacing.xs,
  color: colors.text.primary,
  padding: primitives.spacing.xxs,
});

export const title = style({
  ...typography.heading["s-medium"],
});

export const backButton = style({
  alignSelf: "flex-start",
});

export const row = style({
  display: "grid",
  alignItems: "start",
  gap: primitives.spacing.xxs,
  gridTemplateColumns: "max-content minmax(0, 1fr)",
});

export const label = style({
  ...typography.caption["2xs"],
  color: colors.text.secondary,
});

export const value = style({
  ...typography.caption["2xs"],
  minWidth: 0,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: primitives.spacing.xxxs,
});

export const genres = style({
  minWidth: 0,
});

export const genreLink = style({
  textDecoration: "none",
  color: colors.text.action,
  selectors: {
    "&:hover": { textDecoration: "underline" },
  },
});
