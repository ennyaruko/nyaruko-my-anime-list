import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const content = styleVariants({
  review: {
    ...typography.body.s,
    minWidth: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflowWrap: "anywhere",
    color: colors.text.primary,
  },
  description: {
    ...typography.body.s,
    minWidth: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: colors.text.primary,
    gap: primitives.spacing.xxs,
  },
});

export const emphasis = style({
  fontStyle: "italic",
});

export const paragraph = styleVariants({
  description: { margin: 0 },
  review: {
    selectors: { "&&": { marginBottom: primitives.spacing.xs } },
  },
});

export const strong = style({ fontWeight: "700" });

export const center = style({
  textAlign: "center",
});

export const heading = style({
  ...typography.heading["m-bold"],
  marginTop: primitives.spacing.xs,
  marginBottom: primitives.spacing.xs,
});

export const alignment = styleVariants({
  left: { textAlign: "left" },
  right: { textAlign: "right" },
  center: { textAlign: "center" },
  justify: { textAlign: "justify" },
});

export const list = style({
  paddingLeft: primitives.spacing.l,
  margin: `0 0 ${primitives.spacing.xxs}`,
});

export const listItem = style({ margin: `${primitives.spacing.xxxs} 0` });

export const quote = style({
  color: colors.text.secondary,
  paddingLeft: primitives.spacing.xs,
  margin: `0 0 ${primitives.spacing.xxs}`,
  borderLeft: `3px solid ${colors.border.secondary}`,
});

export const link = style({
  cursor: "pointer",
  textDecoration: "none",
  color: colors.text.action,

  selectors: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export const image = style({
  width: "100%",
  height: "auto",
  display: "block",
  maxWidth: "100%",
  objectFit: "contain",
  marginTop: primitives.spacing.xxs,
  marginBottom: primitives.spacing.xxs,
});

export const divider = style({
  border: 0,
  width: "100%",
  height: "1px",
  flexShrink: 0,
  background: colors.text.tertiary,
  marginTop: primitives.spacing.xs,
  marginBottom: primitives.spacing.xs,
});
