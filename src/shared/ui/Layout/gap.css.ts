import { styleVariants } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const gap = styleVariants({
  l: { gap: primitives.spacing.l },
  m: { gap: primitives.spacing.m },
  s: { gap: primitives.spacing.s },
  xl: { gap: primitives.spacing.xl },
  xs: { gap: primitives.spacing.xs },
  xxl: { gap: primitives.spacing.xxl },
  xxs: { gap: primitives.spacing.xxs },
  huge: { gap: primitives.spacing.huge },
  tiny: { gap: primitives.spacing.tiny },
  xxxl: { gap: primitives.spacing.xxxl },
  xxxs: { gap: primitives.spacing.xxxs },
});
