import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const page = style({
  display: "flex",
  flexDirection: "column",
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
  minHeight: "calc(100svh - 55px - env(safe-area-inset-bottom))",
  "@media": {
    "(min-width: 768px)": {
      minHeight: "calc(100svh - 80px - env(safe-area-inset-bottom))",
    },
  },
});

export const divider = style({
  border: `1px solid ${colors.background.elevation1}`,
});

export const sentinel = style({ height: 1 });
export const empty = style({
  ...typography.caption.xs,
  margin: "auto",
  color: colors.text.secondary,
});
export const notFound = style({ minHeight: "50svh" });
