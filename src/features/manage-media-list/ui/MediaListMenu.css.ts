import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const root = style({
  display: "flex",
  minWidth: "200px",
  width: "fit-content",
  position: "relative",
  flexDirection: "column",
  zIndex: primitives.zIndex.dropdown,
});

export const trigger = style({
  border: 0,
  width: "100%",
  display: "flex",
  font: "inherit",
  minHeight: "36px",
  textAlign: "left",
  cursor: "pointer",
  alignItems: "center",
  gap: primitives.spacing.xxs,
  padding: `0 ${primitives.spacing.xs}`,
});

export const triggerTone = styleVariants({
  CURRENT: {
    color: colors.text.info,
    borderLeft: `4px solid ${colors.text.info}`,
    background: colors.background.elevation1Info,
    boxShadow: `inset 0 -1px 0 ${colors.text.info}`,
  },
  none: {
    color: colors.text.secondary,
    background: colors.background.elevation1,
    borderLeft: `4px solid ${colors.text.secondary}`,
    boxShadow: `inset 0 -1px 0 ${colors.text.tertiary}`,
  },
  PAUSED: {
    color: colors.text.secondary,
    background: colors.background.elevation1,
    borderLeft: `4px solid ${colors.text.secondary}`,
    boxShadow: `inset 0 -1px 0 ${colors.text.tertiary}`,
  },
  PLANNING: {
    color: colors.text.warning,
    borderLeft: `4px solid ${colors.text.warning}`,
    background: colors.background.elevation1Warning,
    boxShadow: `inset 0 -1px 0 ${colors.text.warning}`,
  },
  REPEATING: {
    color: colors.text.feature,
    borderLeft: `4px solid ${colors.text.feature}`,
    background: colors.background.elevation1Feature,
    boxShadow: `inset 0 -1px 0 ${colors.text.feature}`,
  },
  DROPPED: {
    color: colors.text.negative,
    borderLeft: `4px solid ${colors.text.negative}`,
    background: colors.background.elevation1Negative,
    boxShadow: `inset 0 -1px 0 ${colors.text.negative}`,
  },
  COMPLETED: {
    color: colors.text.positive,
    borderLeft: `4px solid ${colors.text.positive}`,
    background: colors.background.elevation1Positive,
    boxShadow: `inset 0 -1px 0 ${colors.text.positive}`,
  },
});

export const triggerOpen = style({
  boxShadow: "none",
});

export const triggerText = style({
  ...typography.heading["m-medium"],
  flex: 1,
  minWidth: 0,
});

export const arrow = style({
  width: "20px",
  flexShrink: 0,
  height: "20px",
  color: colors.text.action,
  transform: "rotate(-90deg)",
  transition: "transform 120ms ease",
});

export const arrowOpen = style({ transform: "rotate(90deg)" });

export const addIcon = style({
  width: "20px",
  flexShrink: 0,
  height: "20px",
  color: colors.text.action,
});

export const options = style({
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
});

export const optionsTone = styleVariants({
  CURRENT: {
    borderLeft: `4px solid ${colors.text.info}`,
  },
  none: {
    borderLeft: `4px solid ${colors.text.secondary}`,
  },
  DROPPED: {
    borderLeft: `4px solid ${colors.text.negative}`,
  },
  PAUSED: {
    borderLeft: `4px solid ${colors.text.secondary}`,
  },
  PLANNING: {
    borderLeft: `4px solid ${colors.text.warning}`,
  },
  REPEATING: {
    borderLeft: `4px solid ${colors.text.feature}`,
  },
  COMPLETED: {
    borderLeft: `4px solid ${colors.text.positive}`,
  },
});

export const option = style({
  ...typography.body["s-medium"],
  border: 0,
  width: "100%",
  display: "flex",
  minHeight: "36px",
  textAlign: "left",
  cursor: "pointer",
  alignItems: "center",
  padding: `0 ${primitives.spacing.xs}`,
  borderBottom: `1px solid ${colors.text.tertiary}`,
  selectors: {
    "&:disabled": {
      opacity: 0.6,
      cursor: "default",
    },
  },
});

export const optionTone = styleVariants({
  CURRENT: {
    color: colors.text.info,
    borderColor: colors.text.info,
    background: colors.background.elevation1Info,
  },
  none: {
    color: colors.text.secondary,
    borderColor: colors.text.tertiary,
    background: colors.background.elevation1,
  },
  PAUSED: {
    color: colors.text.secondary,
    borderColor: colors.text.tertiary,
    background: colors.background.elevation1,
  },
  PLANNING: {
    color: colors.text.warning,
    borderColor: colors.text.warning,
    background: colors.background.elevation1Warning,
  },
  REPEATING: {
    color: colors.text.feature,
    borderColor: colors.text.feature,
    background: colors.background.elevation1Feature,
  },
  DROPPED: {
    color: colors.text.negative,
    borderColor: colors.text.negative,
    background: colors.background.elevation1Negative,
  },
  COMPLETED: {
    color: colors.text.positive,
    borderColor: colors.text.positive,
    background: colors.background.elevation1Positive,
  },
});

export const remove = style({
  ...typography.body["s-medium"],
  border: 0,
  width: "100%",
  display: "flex",
  minHeight: "36px",
  textAlign: "left",
  cursor: "pointer",
  alignItems: "center",
  color: colors.text.negative,
  padding: `0 ${primitives.spacing.xs}`,
  selectors: {
    "&:disabled": {
      opacity: 0.6,
      cursor: "default",
    },
  },
});

export const removeTone = styleVariants({
  none: {
    background: colors.background.elevation1,
  },
  PAUSED: {
    background: colors.background.elevation1,
  },
  CURRENT: {
    background: colors.background.elevation1Info,
  },
  PLANNING: {
    background: colors.background.elevation1Warning,
  },
  DROPPED: {
    background: colors.background.elevation1Negative,
  },
  REPEATING: {
    background: colors.background.elevation1Feature,
  },
  COMPLETED: {
    background: colors.background.elevation1Positive,
  },
});
