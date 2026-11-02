import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const section = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.m,
});

export const controls = style({
  display: "grid",
  gap: primitives.spacing.m,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
});

export const select = style({ minWidth: 0 });
export const fallbackLabel = style({ ...typography.caption.xs });

export const link = style({
  border: 0,
  padding: 0,
  font: "inherit",
  cursor: "pointer",
  textAlign: "left",
  background: "transparent",
  color: colors.text.action,
  selectors: { "&:disabled": { opacity: 0.6, cursor: "default" } },
});

export const episodes = style({ maxHeight: "120px" });
export const episodesViewport = style({ overscrollBehavior: "contain" });

export const episodeButtons = style({
  padding: "2px",
  display: "flex",
  flexWrap: "wrap",
  alignContent: "flex-start",
  gap: primitives.spacing.xs,
});

export const episode = style({
  ...typography.body.m,
  minWidth: "40px",
  minHeight: "40px",
  cursor: "pointer",
  padding: "6px 10px",
  color: colors.text.primary,
  border: "1px solid transparent",
  background: colors.background.elevation1,
  selectors: {
    "&:disabled": { opacity: 0.6, cursor: "wait" },
    "&:focus-visible": {
      outlineOffset: "2px",
      outline: `2px solid ${colors.text.action}`,
    },
  },
});

export const watched = style({
  color: colors.text.positive,
  borderColor: colors.text.positive,
  background: colors.background.elevation1Positive,
});

export const selected = style({
  color: colors.text.info,
  borderColor: colors.text.info,
  background: colors.background.elevation1Info,
});

export const placeholder = style({
  display: "grid",
  minHeight: "150px",
  placeItems: "center",
  padding: primitives.spacing.l,
  background: colors.background.elevation1,
});

export const meta = style({
  display: "flex",
  flexWrap: "wrap",
  gap: primitives.spacing.xs,
  color: colors.text.tertiary,
  ...typography.caption.xs,
});

export const srOnly = style({
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clipPath: "inset(50%)",
});
