import { style, styleVariants } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const profile = style({
  minWidth: 0,
  height: "40px",
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xxs,
});

export const profileLink = style({
  color: "inherit",
  textDecoration: "none",
});

export const avatar = style({
  width: "40px",
  height: "40px",
  flex: "0 0 auto",
  objectFit: "cover",
});

export const avatarFallback = style({
  width: "40px",
  height: "40px",
  flex: "0 0 auto",
  color: colors.text.tertiary,
});

export const details = style({
  minWidth: 0,
  height: "100%",
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: `${primitives.spacing.tiny} 0`,
});

export const heading = style({
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: primitives.spacing.xxs,
});

export const username = style({
  ...typography.body.s,
  minWidth: 0,
  flex: "1 1 auto",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export const externalLinkIcon = style({
  width: "13px",
  height: "13px",
  flex: "0 0 auto",
  color: colors.text.tertiary,
});

export const provider = style({
  ...typography.caption["2xs"],
  color: colors.text.tertiary,
});

export const languageOptions = style({
  width: "100%",
  height: "32px",
  display: "flex",
  position: "relative",
  alignItems: "center",
  gap: primitives.spacing.tiny,
  padding: primitives.spacing.tiny,
  borderRadius: primitives.radii.s,
  background: colors.background.elevation1,
});

export const languageIndicator = style({
  position: "absolute",
  width: "calc(50% - 4px)",
  top: primitives.spacing.tiny,
  left: primitives.spacing.tiny,
  bottom: primitives.spacing.tiny,
  borderRadius: primitives.radii.s,
  transition: "transform 200ms ease",
  background: colors.background.elevation2,
  border: `1px solid ${colors.border.normal}`,
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
  selectors: {
    '[data-language="ru"] &': {
      transform: "translateX(calc(100% + 4px))",
    },
  },
});

export const languageOption = style({
  zIndex: 1,
  flex: "1 1 0",
  height: "100%",
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: primitives.radii.s,
  transition: "color 150ms ease, background-color 150ms ease",
  ...typography.caption["2xs"],
  color: colors.text.secondary,
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
  selectors: {
    "&:hover": {
      background: colors.background.elevation1Hover,
    },
    "&:focus-visible": {
      outlineOffset: "2px",
      outline: `2px solid ${colors.text.action}`,
    },
  },
});

export const languageOptionState = styleVariants({
  default: {},
  active: {
    fontWeight: 500,
    color: colors.text.primary,
  },
});

export const themeThumb = style({
  background: colors.background.elevation1Info,
});

export const sunIcon = style({
  width: "11px",
  height: "11px",
  color: colors.status.warning,
});

export const moonIcon = style({
  width: "9px",
  height: "9px",
  color: colors.text.warning,
});

export const adultContentThumb = styleVariants({
  disabled: { background: colors.background.elevation1Info },
  enabled: { background: colors.background.elevation1Warning },
});

export const adultContentIcon = styleVariants({
  disabled: {
    width: "11px",
    height: "11px",
    color: colors.text.tertiary,
  },
  enabled: {
    width: "11px",
    height: "11px",
    color: colors.status.negative,
  },
});

export const logout = style({
  padding: 0,
  width: "100%",
  display: "flex",
  minHeight: "32px",
  textAlign: "left",
  cursor: "pointer",
  alignItems: "center",
  background: "transparent",
  color: colors.text.primary,
  gap: primitives.spacing.xxs,
});

export const logoutIconSlot = style({
  width: "40px",
  height: "32px",
  display: "flex",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
});

export const logoutIcon = style({
  width: "24px",
  height: "24px",
  color: colors.text.tertiary,
});

export const logoutLabel = style({
  ...typography.caption["2xs"],
});

export const translationIcon = styleVariants({
  enabled: { width: "15px", height: "15px", color: colors.text.action },
  disabled: { width: "15px", height: "15px", color: colors.text.tertiary },
});
