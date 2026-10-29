import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const page = style({
  paddingTop: primitives.spacing.l,
  paddingBottom: primitives.spacing.l,
});
export const section = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.m,
});
export const title = style({
  ...typography.heading["2xl"],
  margin: 0,
  overflowWrap: "anywhere",
});
export const controls = style({
  display: "grid",
  gap: primitives.spacing.m,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
});
export const commentSort = style({ width: "fit-content" });
export const select = style({ minWidth: 0 });
export const languages = style({
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xs,
});
export const fallbackLabel = style({ ...typography.caption.xs });
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
export const replyLink = style({
  ...typography.caption["2xs"],
  border: 0,
  padding: 0,
  cursor: "pointer",
  textAlign: "left",
  color: colors.text.action,
  background: "transparent",
});
export const activeLanguage = style({
  color: colors.text.negative,
  textDecoration: "underline",
});
export const episodes = style({
  padding: "2px",
  display: "flex",
  flexWrap: "wrap",
  overflowY: "auto",
  maxHeight: "260px",
  gap: primitives.spacing.xs,
});
export const episode = style({
  ...typography.body.m,
  minWidth: "40px",
  minHeight: "40px",
  cursor: "pointer",
  padding: "6px 10px",
  color: colors.text.primary,
  border: "1px solid transparent",
  background: colors.background.elevation1,
  selectors: {
    "&:disabled": { opacity: 0.6, cursor: "wait" },
    "&:focus-visible": {
      outlineOffset: "2px",
      outline: `2px solid ${colors.text.action}`,
    },
  },
});
export const watched = style({
  color: colors.text.positive,
  borderColor: colors.text.positive,
  background: colors.background.elevation1Positive,
});
export const selected = style({
  color: colors.text.info,
  borderColor: colors.text.info,
  background: colors.background.elevation1Info,
});
export const message = style({ margin: 0, color: colors.text.secondary });
export const placeholder = style({
  display: "grid",
  minHeight: "150px",
  placeItems: "center",
  padding: primitives.spacing.l,
  background: colors.background.elevation1,
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
  display: "flex",
  alignItems: "flex-start",
  gap: primitives.spacing.xs,
  justifyContent: "space-between",
});
export const orderDescription = style({ ...typography.caption["2xs"] });
export const comment = style({
  minWidth: 0,
  overflowWrap: "anywhere",
  paddingTop: primitives.spacing.m,
  borderTop: `1px dashed ${colors.border.secondary}`,
});
export const commentBody = style({ marginTop: primitives.spacing.xs });
export const meta = style({
  display: "flex",
  flexWrap: "wrap",
  gap: primitives.spacing.xs,
  color: colors.text.tertiary,
  ...typography.caption.xs,
});
export const votePositive = style({ color: colors.status.positive });
export const voteNegative = style({ color: colors.status.negative });
export const replies = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.m,
  marginTop: primitives.spacing.m,
  marginLeft: primitives.spacing.m,
  paddingLeft: primitives.spacing.m,
  borderLeft: `2px solid ${colors.border.secondary}`,
});
export const srOnly = style({
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clipPath: "inset(50%)",
});
