import { style, globalStyle, styleVariants } from "@vanilla-extract/css";

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

export const drawerHeader = style({
  display: "grid",
  flex: "0 0 auto",
  alignItems: "center",
  gap: primitives.spacing.xs,
  zIndex: primitives.zIndex.sticky,
  boxShadow: primitives.shadow.small,
  background: colors.background.base,
  gridTemplateColumns: "1fr auto 1fr",
  padding: `calc(${primitives.spacing.s} + env(safe-area-inset-top)) ${primitives.spacing.xs} ${primitives.spacing.xxs}`,
});

export const backButton = style({ justifySelf: "start" });

export const appliedCount = style({
  ...typography.caption["2xs"],
  textAlign: "center",
  whiteSpace: "nowrap",
  color: colors.text.primary,
});
export const resetButton = style({ justifySelf: "end" });

export const drawerContent = style({
  padding: `${primitives.spacing.xs} 0`,
});

export const modeControls = style({
  display: "flex",
  gap: primitives.spacing.xxxs,
});

const modeButtonBase = {
  ...typography.caption["2xs"],
  border: 0,
  cursor: "pointer",
  background: "transparent",
  selectors: { "&:hover": { textDecoration: "underline" } },
};

export const modeButton = styleVariants({
  include: {
    ...modeButtonBase,
    color: colors.text.action,
  },
  exclude: {
    ...modeButtonBase,
    color: colors.text.action,
  },
});

export const modeButtonActive = style({
  color: colors.text.negative,
  textDecoration: "underline",
});

export const modeSeparator = style({
  ...typography.caption["2xs"],
  color: colors.text.tertiary,
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
