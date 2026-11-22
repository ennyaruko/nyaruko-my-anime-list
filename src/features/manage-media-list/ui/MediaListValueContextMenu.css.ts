import { style } from "@vanilla-extract/css";

import { primitives, typography } from "@/shared/styles";

export const content = style({
  minWidth: "190px",
});

export const form = style({
  display: "flex",
  userSelect: "text",
  flexDirection: "column",
  gap: primitives.spacing.xs,
});

export const label = style({
  ...typography.caption.xs,
});

export const saveButton = style({
  width: "100%",
});
