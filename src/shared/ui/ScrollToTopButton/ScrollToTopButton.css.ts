import { style } from "@vanilla-extract/css";

import { colors, primitives, fixedToContainerRight } from "@/shared/styles";

export const button = style([
  fixedToContainerRight,
  {
    padding: 0,
    opacity: 0,
    width: "44px",
    height: "44px",
    position: "fixed",
    minHeight: "44px",
    borderRadius: "50%",
    pointerEvents: "none",
    transform: "translateY(8px)",
    boxShadow: primitives.shadow.xs,
    zIndex: primitives.zIndex.sticky,
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
  },
]);

export const icon = style({
  transform: "rotate(90deg)",
  color: colors.text.primary,
});
