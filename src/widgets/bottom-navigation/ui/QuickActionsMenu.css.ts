import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const action = style({
  padding: 0,
  width: "100%",
  display: "flex",
  minHeight: "32px",
  textAlign: "left",
  cursor: "pointer",
  alignItems: "center",
  background: "transparent",
  color: colors.text.primary,
  gap: primitives.spacing.xxs,
  ...typography.caption["2xs"],
  selectors: {
    "&:hover": { color: colors.text.action },
    "&:disabled:hover": { color: colors.text.tertiary },
    "&:disabled": {
      cursor: "not-allowed",
      color: colors.text.tertiary,
    },
    "&:focus-visible": {
      outlineOffset: "2px",
      outline: `2px solid ${colors.text.action}`,
    },
  },
});

export const actionIcon = style({
  width: "24px",
  height: "24px",
  flex: "0 0 40px",
  color: colors.text.tertiary,
});
