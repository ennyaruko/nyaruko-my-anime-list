import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const page = style({
  margin: "0 auto",
  padding: "32px 0 64px",
  width: "min(100% - 32px, 1040px)",
  "@media": {
    "(max-width: 520px)": {
      paddingTop: "20px",
      width: "min(100% - 24px, 1040px)",
    },
  },
});
export const top = style({
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.m,
  justifyContent: "space-between",
  marginBottom: primitives.spacing.xl,
});
export const profile = style({
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.s,
});
export const avatar = style({
  width: "52px",
  height: "52px",
  objectFit: "cover",
  borderRadius: "50%",
  background: colors.background.elevation1,
});
export const userName = style({
  ...typography.heading["l-medium"],
  margin: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
});
export const subtle = style({
  ...typography.caption.xs,
  marginTop: "3px",
  color: colors.text.tertiary,
});
export const link = style({
  textDecoration: "none",
  color: colors.text.action,
  ...typography.body.s,
  ":hover": { textDecoration: "underline" },
});
export const section = style({ marginTop: primitives.spacing.xl });
export const heading = style({
  padding: "10px 14px",
  margin: `0 0 ${primitives.spacing.s}`,
  background: colors.background.elevation1,
  borderLeft: `4px solid ${colors.text.secondary}`,
  ...typography.heading["m-medium"],
});
export const genreWrap = style({
  display: "flex",
  flexWrap: "wrap",
  gap: primitives.spacing.xxs,
});
export const genre = style({
  cursor: "pointer",
  padding: "6px 10px",
  borderRadius: "999px",
  color: colors.text.secondary,
  background: colors.background.base,
  border: `1px solid ${colors.border.normal}`,
  ...typography.caption.xs,
});
export const selectedGenre = style({
  color: colors.text.primaryOnLight,
  background: colors.brand.darkBlue,
  borderColor: colors.brand.darkBlue,
});
export const tabs = style({
  display: "flex",
  gap: "6px 16px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  marginBottom: primitives.spacing.s,
});
export const tab = style({
  padding: "4px 0",
  cursor: "pointer",
  color: colors.text.secondary,
  borderBottom: "2px solid transparent",
  ...typography.caption.xs,
});
export const tabActive = style({
  color: colors.text.action,
  borderColor: colors.text.action,
});
export const toolbar = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: primitives.spacing.xs,
  margin: `${primitives.spacing.s} 0`,
});
export const label = style({
  ...typography.body.s,
  color: colors.text.secondary,
});
export const select = style({
  minHeight: "36px",
  padding: "0 30px 0 10px",
  color: colors.text.primary,
  borderRadius: primitives.radii.xs,
  background: colors.background.base,
  border: `1px solid ${colors.border.normal}`,
});
export const cardGrid = style({
  display: "grid",
  gap: "24px 18px",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  "@media": {
    "(max-width: 760px)": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
    "(max-width: 520px)": {
      gap: "20px 12px",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
});
export const card = style({
  minWidth: 0,
  textDecoration: "none",
  color: colors.text.primary,
});
export const posterWrap = style({
  overflow: "hidden",
  aspectRatio: "0.72",
  position: "relative",
  borderRadius: primitives.radii.xs,
  background: colors.background.elevation1,
});
export const poster = style({
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
});
export const score = style({ top: "8px", left: "8px", position: "absolute" });
export const progress = style({
  left: 0,
  right: 0,
  bottom: 0,
  position: "absolute",
});
export const cardTitle = style({
  marginTop: "8px",
  overflow: "hidden",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  color: colors.text.action,
  WebkitBoxOrient: "vertical",
  ...typography.body.s,
});
export const meta = style({
  display: "flex",
  marginTop: "4px",
  color: colors.text.tertiary,
  justifyContent: "space-between",
  ...typography.caption.xs,
});
export const state = style({
  textAlign: "center",
  padding: "52px 16px",
  color: colors.text.secondary,
  ...typography.body.m,
});
export const error = style({ color: colors.text.negative });
export const stat = style({
  color: colors.text.tertiary,
  ...typography.caption.xs,
});
export const statusHeading = styleVariants({
  CURRENT: {
    color: colors.text.info,
    borderColor: colors.text.info,
    background: colors.background.elevation1Info,
  },
  REPEATING: {
    color: colors.text.info,
    borderColor: colors.text.info,
    background: colors.background.elevation1Info,
  },
  PAUSED: {
    color: colors.text.secondary,
    borderColor: colors.text.secondary,
    background: colors.background.elevation1,
  },
  UNKNOWN: {
    color: colors.text.secondary,
    borderColor: colors.text.secondary,
    background: colors.background.elevation1,
  },
  PLANNING: {
    color: colors.text.warning,
    borderColor: colors.text.warning,
    background: colors.background.elevation1Warning,
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
