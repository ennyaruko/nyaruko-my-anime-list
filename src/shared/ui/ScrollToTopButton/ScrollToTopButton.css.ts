import { style } from "@vanilla-extract/css";

import { colors, primitives } from "@/shared/styles";

export const button = style({
  padding: 0,
  opacity: 0,
  width: "44px",
  height: "44px",
  position: "fixed",
  minHeight: "44px",
  borderRadius: "50%",
  pointerEvents: "none",
  right: primitives.spacing.xs,
  transform: "translateY(8px)",
  zIndex: primitives.zIndex.sticky,
  boxShadow: primitives.shadow.small,
  transition: "opacity 160ms ease, transform 160ms ease",
  bottom: `calc(55px + env(safe-area-inset-bottom) + ${primitives.spacing.xs})`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transitionDuration: "0.01ms",
    },
  },
  selectors: {
    '&[data-visible="true"]': {
      opacity: 1,
      pointerEvents: "auto",
      transform: "translateY(0)",
    },
  },
});

export const icon = style({
  transform: "rotate(90deg)",
  color: colors.text.primary,
});
