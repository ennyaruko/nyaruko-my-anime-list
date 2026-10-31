import { style } from "@vanilla-extract/css";

import { colors, primitives } from "@/shared/styles";

export const root = style({
  left: 0,
  right: 0,
  width: "100%",
  display: "flex",
  margin: "0 auto",
  position: "fixed",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: primitives.zIndex.sticky,
  background: colors.background.base,
  boxShadow: primitives.shadow.small,
  padding: `0 ${primitives.spacing.xl}`,
  bottom: "env(safe-area-inset-bottom)",
  "@media": {
    "(min-width: 768px)": {
      bottom: "16px",
      minHeight: "64px",
      borderRadius: "16px",
      width: "min(100% - 32px, 520px)",
      padding: `0 ${primitives.spacing.l}`,
      border: `1px solid ${colors.border.normal}`,
    },
  },
});

export const popover = style({
  width: "220px",
  display: "flex",
  outline: "none",
  flexDirection: "column",
  gap: primitives.spacing.m,
  color: colors.text.primary,
  zIndex: primitives.zIndex.popover,
  background: colors.background.base,
  boxShadow: primitives.shadow.popup,
  border: `1px solid ${colors.border.normal}`,
  padding: `${primitives.spacing.m} ${primitives.spacing.xs}`,
});
