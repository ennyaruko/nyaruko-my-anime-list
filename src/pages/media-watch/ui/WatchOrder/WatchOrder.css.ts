import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const section = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.m,
});

export const order = style({ margin: 0, paddingLeft: "24px" });

export const orderRow = style({
  ...typography.caption["2xs"],
  padding: "8px 0",
  overflowWrap: "anywhere",
  color: colors.text.secondary,
});

export const orderTitle = style({
  ...typography.caption["2xs-medium"],
  color: colors.text.primary,
});

export const orderLinkTitle = style({
  ...typography.caption["2xs-medium"],
  color: colors.text.action,
});

export const orderContent = style({
  minWidth: 0,
  display: "flex",
  alignItems: "flex-start",
  gap: primitives.spacing.xs,
  justifyContent: "space-between",
});

export const orderCopy = style({ minWidth: 0, flex: "1 1 auto" });
export const orderStatus = style({ flex: "0 0 auto" });
export const orderDescription = style({ ...typography.caption["2xs"] });

export const link = style({
  border: 0,
  padding: 0,
  font: "inherit",
  cursor: "pointer",
  textAlign: "left",
  background: "transparent",
  color: colors.text.action,
  selectors: { "&:disabled": { opacity: 0.6, cursor: "default" } },
});
