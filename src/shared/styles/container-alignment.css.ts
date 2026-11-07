import { style } from "@vanilla-extract/css";

import { primitives } from "./tokens/primitives.css";

const containerMaxWidth = "880px";
const floatingButtonInset = "10px";

export const fixedToContainerLeft = style({
  left: primitives.spacing.xs,
  "@media": {
    "(min-width: 1024px)": {
      left: `calc((100vw - ${containerMaxWidth}) / 2 + ${primitives.spacing.xl} - ${floatingButtonInset})`,
    },
    "(min-width: 640px) and (max-width: 1023px)": {
      left: `max(${primitives.spacing.l}, calc((100vw - ${containerMaxWidth}) / 2 + ${primitives.spacing.l}))`,
    },
  },
});

export const fixedToContainerRight = style({
  right: primitives.spacing.xs,
  "@media": {
    "(min-width: 1024px)": {
      right: `calc((100vw - ${containerMaxWidth}) / 2 + ${primitives.spacing.xl} - ${floatingButtonInset})`,
    },
    "(min-width: 640px) and (max-width: 1023px)": {
      right: `max(${primitives.spacing.l}, calc((100vw - ${containerMaxWidth}) / 2 + ${primitives.spacing.l}))`,
    },
  },
});
