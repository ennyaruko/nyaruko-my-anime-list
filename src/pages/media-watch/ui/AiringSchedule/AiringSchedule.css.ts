import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const section = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.m,
});

export const heading = style({ margin: 0 });

export const list = style({
  margin: 0,
  padding: 0,
  display: "grid",
  listStyle: "none",
  gap: primitives.spacing.xxs,
});

export const item = style({
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.m,
  justifyContent: "space-between",
  padding: primitives.spacing.xxs,
  borderRadius: primitives.radii.s,
  background: colors.background.elevation1,
  "@media": {
    "screen and (max-width: 480px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: primitives.spacing.xxxs,
    },
  },
});

export const episode = style({
  ...typography.caption["2xs-medium"],
  overflowWrap: "anywhere",
  color: colors.text.primary,
});

export const time = style({
  ...typography.caption["2xs"],
  flex: "0 0 auto",
  color: colors.text.secondary,
  fontVariantNumeric: "tabular-nums",
});
