import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives } from "../../styles";

export const root = style({
  width: "100%",
  display: "grid",
  alignItems: "center",
  gap: primitives.spacing.xs,
  gridTemplateColumns: "1fr auto 1fr",
});

export const variant = styleVariants({
  plain: {
    flex: "0 0 auto",
    minHeight: "32px",
  },
  drawer: {
    flex: "0 0 auto",
    zIndex: primitives.zIndex.sticky,
    boxShadow: primitives.shadow.small,
    background: colors.background.base,
    padding: `calc(${primitives.spacing.s} + env(safe-area-inset-top)) ${primitives.spacing.xs} ${primitives.spacing.xxs}`,
  },
});

export const leading = style({
  minWidth: 0,
  display: "flex",
  justifyContent: "flex-start",
});

export const center = style({
  minWidth: 0,
  display: "flex",
  justifyContent: "center",
});

export const trailing = style({
  minWidth: 0,
  display: "flex",
  justifyContent: "flex-end",
});
