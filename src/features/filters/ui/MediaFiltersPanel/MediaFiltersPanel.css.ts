import { style, globalStyle } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const sort = style({ flex: "1 1 auto" });

export const filterButton = style({ flex: "0 0 auto" });

export const checkedFilterIcon = style({
  width: "20px",
  height: "20px",
  color: colors.text.primary,
});
globalStyle(`${checkedFilterIcon} > path[class$="__filterCheckMark"]`, {
  fill: colors.status.positive,
});

export const drawer = style({
  padding: 0,
  minHeight: 0,
  height: "100%",
  overflow: "hidden",
});

export const appliedCount = style({
  ...typography.caption["2xs"],
  textAlign: "center",
  whiteSpace: "nowrap",
  color: colors.text.primary,
});

export const drawerContent = style({
  padding: `${primitives.spacing.xs} 0`,
});

export const selectedValues = style({
  ...typography.caption["2xs"],
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  color: colors.text.action,
  marginTop: primitives.spacing.xxs,
  columnGap: primitives.spacing.tiny,
});

export const selectedValue = style({
  border: 0,
  padding: 0,
  color: "inherit",
  cursor: "pointer",
  textAlign: "left",
  background: "transparent",
  selectors: { "&:hover": { textDecoration: "underline" } },
});

export const drawerFooter = style({
  display: "flex",
  flex: "0 0 auto",
  zIndex: primitives.zIndex.sticky,
  boxShadow: primitives.shadow.small,
  background: colors.background.base,
  padding: `${primitives.spacing.xs} ${primitives.spacing.xs} calc(${primitives.spacing.xs} + env(safe-area-inset-bottom))`,
});

export const saveButton = style({ width: "100%" });
