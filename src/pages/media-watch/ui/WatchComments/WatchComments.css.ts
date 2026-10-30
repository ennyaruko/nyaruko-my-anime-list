import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const section = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.m,
});

export const commentSort = style({ width: "fit-content" });

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

export const replyLink = style({
  ...typography.caption["2xs"],
  border: 0,
  padding: 0,
  cursor: "pointer",
  textAlign: "left",
  color: colors.text.action,
  background: "transparent",
});

export const replies = style({
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.m,
  marginTop: primitives.spacing.m,
  marginLeft: primitives.spacing.m,
  paddingLeft: primitives.spacing.m,
  borderLeft: `2px solid ${colors.border.secondary}`,
});
