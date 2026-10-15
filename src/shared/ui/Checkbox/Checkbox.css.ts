import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

const checkboxBase = style({
  width: "14px",
  height: "14px",
  minWidth: "14px",
  minHeight: "14px",
});

export const root = style([
  checkboxBase,
  {
    padding: 0,
    appearance: "none",
    alignItems: "center",
    position: "relative",
    display: "inline-flex",
    boxSizing: "border-box",
    justifyContent: "center",
    borderRadius: primitives.radii.xs,
    background: colors.background.base,
    border: `1px solid ${colors.border.secondary}`,
    selectors: {
      '&[data-state="checked"]': {
        background: colors.status.positive,
        borderColor: colors.status.positive,
      },
    },
  },
]);

export const checkboxRoot = style({
  selectors: {
    "&:disabled": { cursor: "not-allowed" },
    "&:not(:disabled):hover": {
      cursor: "pointer",
      borderColor: colors.border.secondaryHover,
    },
  },
});

export const checkboxVariant = styleVariants({
  default: {},
  minus: {
    selectors: {
      '&[data-state="checked"]': {
        background: colors.status.negative,
        borderColor: colors.status.negative,
      },
    },
  },
});

export const checkboxCheck = style({
  inset: 0,
  display: "grid",
  position: "absolute",
  placeItems: "center",
});
export const checkboxCheckIcon = style({
  width: "9px",
  height: "9px",
  display: "block",
  color: colors.text.primaryOnLight,
});
export const checkboxMinus = style({
  width: "8px",
  height: "8px",
  display: "block",
  color: colors.text.primaryOnLight,
});

const labeledBase = style({
  width: "100%",
  display: "flex",
  minHeight: "34px",
  alignItems: "center",
  boxSizing: "border-box",
  gap: primitives.spacing.xxs,
  padding: `${primitives.spacing.xxs} ${primitives.spacing.xxxs}`,
});

export const labeled = style([
  labeledBase,
  {
    cursor: "pointer",
    selectors: {
      "&:hover": { background: colors.background.elevation1Hover },
      "&:active": { background: colors.background.elevation1Pressed },
    },
  },
]);

export const labeledDisabled = style({
  cursor: "not-allowed",
  selectors: {
    "&:hover": { background: "transparent" },
    "&:active": { background: "transparent" },
  },
});

export const labeledControl = style({
  selectors: {
    [`${labeled}:hover &:not(:disabled)`]: {
      borderColor: colors.border.secondaryHover,
    },
  },
});

export const labeledChecked = style({
  background: colors.background.elevation1Pressed,
});

export const label = style({
  color: colors.text.secondary,
});

export const labelSizes = styleVariants({
  l: { ...typography.body.m },
  s: { ...typography.caption["2xs"] },
});

export const description = style({
  ...typography.caption["2xs"],
  width: "100%",
  minWidth: "90px",
  marginLeft: "auto",
  overflow: "hidden",
  textAlign: "right",
  userSelect: "none",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export const selectedLabel = style({ color: colors.text.secondaryHover });
export const labeledSkeleton = style([
  labeledBase,
  { gap: primitives.spacing.xxs },
]);

export const skeletonCheckbox = style([
  checkboxBase,
  {
    flex: "0 0 auto",
  },
]);

export const skeletonLine = style({
  flex: 1,
  minWidth: 0,
  height: "18px",
});
