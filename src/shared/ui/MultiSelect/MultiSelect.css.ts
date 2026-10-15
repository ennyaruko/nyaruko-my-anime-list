import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  width: "100%",
  minWidth: "160px",
});

export const labeled = style({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xxs,
});

export const label = style({
  ...typography.body.s,
  flex: "0 0 auto",
  color: colors.text.primary,
});

export const labeledField = style({ flex: "1 1 auto" });

export const trigger = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xxxs,
  padding: primitives.spacing.xxs,
  background: colors.background.elevation1,
  selectors: {
    "&:has(input:disabled)": { cursor: "not-allowed" },
    "&:focus-within": {
      outline: `1px solid ${colors.border.secondaryHover}`,
    },
    "&:not(:has(input:disabled)):hover": {
      background: colors.background.elevation2,
    },
  },
});

export const input = style({
  ...typography.body.m,
  minWidth: 0,
  width: "100%",
  outline: "none",
  flex: "1 1 auto",
  background: "transparent",
  color: colors.text.primary,
  selectors: {
    "&:disabled": { cursor: "not-allowed" },
    "&::placeholder": {
      opacity: 1,
      color: colors.text.secondary,
    },
  },
});

export const triggerNotSearchable = style({ cursor: "pointer" });

export const inputNotSearchable = style({ cursor: "pointer" });

export const icon = style({
  flex: "0 0 auto",
  color: colors.text.secondary,
});

export const iconButton = style({
  width: "20px",
  height: "20px",
  display: "grid",
  flex: "0 0 auto",
  cursor: "pointer",
  placeItems: "center",
  color: colors.text.primary,
  selectors: { "&:disabled": { cursor: "not-allowed" } },
});

export const clearButtonHidden = style({
  visibility: "hidden",
  pointerEvents: "none",
});

export const clearIcon = style({
  width: "14px",
  height: "14px",
  color: colors.text.action,
});

export const chevron = style({
  width: "20px",
  height: "20px",
  transform: "rotate(-90deg)",
  transition: "transform 120ms ease",
});

export const chevronOpen = style({ transform: "rotate(90deg)" });

export const content = style({
  outline: "none",
  overflow: "hidden",
  maxHeight: "150px",
  color: colors.text.primary,
  zIndex: primitives.zIndex.dropdown,
  boxShadow: primitives.shadow.popup,
  background: colors.background.elevation1,
});

export const options = style({
  display: "flex",
  flexDirection: "column",
  padding: `${primitives.spacing.xxs} 0`,
});

export const optionCheckbox = style({
  minHeight: "44px",
  padding: `${primitives.spacing.xxs}`,
  selectors: {
    "&:hover": { background: colors.background.elevation2 },
  },
});

export const optionCheckboxSelected = style({
  background: colors.background.elevation1Pressed,
});

export const empty = style({
  ...typography.body.m,
  color: colors.text.secondary,
  padding: primitives.spacing.xxs,
});
