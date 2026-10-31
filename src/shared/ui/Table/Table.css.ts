import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const root = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  maxWidth: "100%",
  flexDirection: "column",
  gap: primitives.spacing.xxxs,
});
export const rows = style({
  minWidth: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: primitives.spacing.tiny,
});
export const row = styleVariants({
  table1: { background: colors.table.state1 },
  table2: { background: colors.table.state2 },
  table3: { background: colors.table.state3 },
});
export const item = style({
  ...typography.caption["2xs"],
  minWidth: 0,
  width: "100%",
  display: "flex",
  userSelect: "none",
  position: "relative",
  alignItems: "center",
  whiteSpace: "nowrap",
  color: colors.text.primary,
  padding: `${primitives.spacing.tiny} ${primitives.spacing.xxxs}`,
});
export const fill = style({
  inset: 0,
  zIndex: 0,
  position: "absolute",
  width: "var(--fill-width)",
});
export const fillFull = style({ width: "100%" });
export const itemContent = style({
  zIndex: 1,
  minWidth: 0,
  width: "100%",
  display: "flex",
  position: "relative",
  alignItems: "center",
  gap: primitives.spacing.xxs,
  justifyContent: "space-between",
});
export const itemContentFlow = style({ justifyContent: "flex-start" });
export const label = style({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
});
export const value = style({
  zIndex: 2,
  position: "absolute",
  right: `calc(100% - var(--fill-width) + ${primitives.spacing.xxxs})`,
});
export const valueAfterLabel = style({
  position: "static",
});
export const itemOverlay = style({
  inset: 0,
  zIndex: 2,
  display: "flex",
  position: "absolute",
  alignItems: "center",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  color: colors.text.primaryOnLight,
  padding: `${primitives.spacing.tiny} ${primitives.spacing.xxxs}`,
});
export const itemOverlayFull = style({ clipPath: "inset(0)" });
export const itemClickable = style({
  cursor: "pointer",
  textAlign: "left",
  appearance: "none",
});
export const more = style({
  ...typography.caption["2xs"],
  cursor: "pointer",
  width: "fit-content",
  color: colors.text.action,
  selectors: {
    "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
  },
});
export const bar = style({
  height: "17px",
  display: "block",
  maxWidth: "100%",
});
