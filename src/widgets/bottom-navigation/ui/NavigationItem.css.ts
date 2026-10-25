import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  height: "100%",
  display: "flex",
  flex: "0 0 auto",
  minWidth: "60px",
  cursor: "pointer",
  alignItems: "center",
  whiteSpace: "nowrap",
  textDecoration: "none",
  flexDirection: "column",
  justifyContent: "center",
  background: "transparent",
  gap: primitives.spacing.tiny,
  padding: `${primitives.spacing.xxs} 0`,
});

export const icon = style({
  width: "24px",
  height: "24px",
  flex: "0 0 auto",
});

export const state = styleVariants({
  active: { color: colors.text.primary },
  default: { color: colors.text.tertiary },
});

export const label = style({
  ...typography.caption["2xs"],
});
