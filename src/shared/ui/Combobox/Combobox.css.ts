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

export const labeledField = style({
  flex: "1 1 auto",
});

export const trigger = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xxxs,
  background: colors.background.elevation1,
  padding: `${primitives.spacing.xxxs} ${primitives.spacing.xxxs} ${primitives.spacing.xxxs} ${primitives.spacing.xxs}`,

  selectors: {
    "&:has(input:disabled)": {
      cursor: "not-allowed",
    },

    "&:focus-within": {
      outline: `1px solid ${colors.border.secondaryHover}`,
    },

    "&:not(:has(input:disabled)):hover": {
      background: colors.background.elevation2,
    },
  },
});

export const triggerNotSearchable = style({
  cursor: "pointer",
});

export const input = style({
  ...typography.caption["2xs"],
  minWidth: 0,
  width: "100%",
  height: "100%",
  outline: "none",
  flex: "1 1 auto",
  background: "transparent",
  color: colors.text.primary,

  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
    },

    "&::placeholder": {
      opacity: 1,
      color: colors.text.secondary,
    },
  },
});

export const inputNotSearchable = style({
  cursor: "pointer",
});

export const toggleButton = style({
  width: "20px",
  height: "20px",
  display: "grid",
  flex: "0 0 auto",
  cursor: "pointer",
  placeItems: "center",
  color: colors.text.primary,

  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
});

export const chevron = style({
  width: "20px",
  height: "20px",
  transform: "rotate(-90deg)",
  transition: "transform 120ms ease",
});

export const chevronOpen = style({
  transform: "rotate(90deg)",
});

export const loadingIcon = style({
  color: colors.text.secondary,
});

export const clearButton = style({
  width: "20px",
  height: "20px",
  display: "grid",
  flex: "0 0 auto",
  cursor: "pointer",
  placeItems: "center",
  color: colors.text.action,
});

export const clearButtonHidden = style({
  visibility: "hidden",
  pointerEvents: "none",
});

export const clearIcon = style({
  width: "14px",
  height: "14px",
});

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
  gap: primitives.spacing.tiny,
  padding: `${primitives.spacing.xxs} 0`,
});

export const option = style({
  ...typography.caption["2xs"],
  border: 0,
  width: "100%",
  display: "flex",
  textAlign: "left",
  cursor: "pointer",
  alignItems: "center",
  color: colors.text.primary,
  padding: `${primitives.spacing.xxs}`,

  selectors: {
    "&:hover, &:focus-visible": {
      background: colors.background.elevation2,
    },
  },
});

export const optionSelected = style({
  background: colors.background.elevation1Pressed,
});

export const empty = style({
  ...typography.caption["2xs"],
  color: colors.text.secondary,
  padding: `${primitives.spacing.xxs}`,
});
