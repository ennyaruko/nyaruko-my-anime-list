import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const content = style({
  display: "flex",
  outline: "none",
  minWidth: "170px",
  userSelect: "none",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
  boxShadow: primitives.shadow.xs,
  zIndex: primitives.zIndex.popover,
  borderRadius: primitives.radii.sm,
  backgroundColor: colors.background.base,
  padding: `${primitives.spacing.xxs} ${primitives.spacing.s}`,
});

export const item = style({
  ...typography.caption.xs,
  border: 0,
  flexShrink: 0,
  display: "flex",
  minHeight: "32px",
  textAlign: "left",
  cursor: "pointer",
  alignItems: "center",
  whiteSpace: "nowrap",
  background: "transparent",
  gap: primitives.spacing.xs,
  borderRadius: primitives.radii.sm,
  marginInline: `calc(0px - ${primitives.spacing.xxs})`,
  padding: `${primitives.spacing.xxs} ${primitives.spacing.xxs}`,
  selectors: {
    "&:focus-visible": {
      outline: "none",
    },
    "&[data-highlighted]": {
      backgroundColor: colors.background.elevation1,
    },
    "&[data-disabled]": {
      cursor: "not-allowed",
      color: colors.text.tertiary,
    },
  },
});

export const itemTone = styleVariants({
  default: { color: colors.text.primary },
  destructive: { color: colors.status.negative },
});

export const separator = style({
  width: "100%",
  height: "1px",
  flexShrink: 0,
  margin: `${primitives.spacing.tiny} 0`,
  backgroundColor: colors.background.elevation1,
});
