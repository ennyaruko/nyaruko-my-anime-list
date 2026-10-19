import { style, globalStyle } from "@vanilla-extract/css";

import { colors, primitives, typography } from "@/shared/styles";

export const page = style({
  display: "flex",
  overflow: "hidden",
  minHeight: "100svh",
  position: "relative",
  justifyContent: "center",
  background: colors.background.base,
});

export const content = style({
  width: "100%",
  height: "100%",
  display: "flex",
  minHeight: "100svh",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: `80px ${primitives.spacing.m}`,
});

export const header = style({
  zIndex: 2,
  display: "flex",
  position: "relative",
  flexDirection: "column",
  gap: primitives.spacing.xs,
});

export const title = style({
  ...typography.heading["3xl-medium"],
  color: colors.text.primary,
});

export const description = style({
  ...typography.body.s,
  maxWidth: "230px",
  color: colors.text.secondary,
});

export const illustration = style({
  zIndex: 0,
  top: "40px",
  left: "-2px",
  width: "100%",
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  backgroundSize: "100%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center top",
  backgroundImage: "url('/images/login.png')",
});

export const illustrationFade = style({
  inset: 0,
  zIndex: 1,
  position: "absolute",
  pointerEvents: "none",
  backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${colors.background.base} 60%, transparent) 16%, color-mix(in srgb, ${colors.background.base} 20%, transparent) 33%, color-mix(in srgb, ${colors.background.base} 45%, transparent) 54%, color-mix(in srgb, ${colors.background.base} 80%, transparent) 58%, color-mix(in srgb, ${colors.background.base} 98%, transparent) 62%, ${colors.background.base} 78%)`,
});

export const login = style({
  zIndex: 2,
  position: "relative",
});

export const registerPrompt = style({
  ...typography.body.s,
  textAlign: "center",
  color: colors.text.primary,
});

globalStyle(`${registerPrompt} a`, {
  color: colors.text.action,
  textUnderlineOffset: "2px",
});
