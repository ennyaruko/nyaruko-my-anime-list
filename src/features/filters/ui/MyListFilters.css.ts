import { style } from "@vanilla-extract/css";

import { primitives } from "@/shared/styles";

export const drawer = style({
  gap: primitives.spacing.m,
  padding: primitives.spacing.l,
});

export const drawerHeader = style({
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.m,
  justifyContent: "space-between",
});
