import { style } from "@vanilla-extract/css";

import { themeVars, primitives } from "@/shared/styles";

const transition = "320ms cubic-bezier(0.22, 1, 0.36, 1)";

export const root = style({
  inset: 0,
  position: "fixed",
  isolation: "isolate",
  pointerEvents: "none",
  zIndex: primitives.zIndex.modal,
  selectors: {
    '&[data-state="open"]': { pointerEvents: "auto" },
  },
});

export const overlay = style({
  inset: 0,
  opacity: 0,
  position: "absolute",
  transition: "opacity 280ms ease",
  background: "rgb(15 23 42 / 48%)",
  selectors: {
    [`${root}[data-state="open"] &`]: { opacity: 1 },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transitionDelay: "0s",
      transitionDuration: "0.01ms",
    },
  },
});

export const panel = style({
  top: 0,
  bottom: 0,
  display: "flex",
  height: "100vh",
  outline: "none",
  maxWidth: "100vw",
  overflowY: "auto",
  overflowX: "hidden",
  position: "absolute",
  visibility: "visible",
  flexDirection: "column",
  width: "min(28rem, 100vw)",
  overscrollBehavior: "contain",
  color: themeVars.color.text.primary,
  boxShadow: primitives.shadow.medium,
  background: themeVars.color.background.base,
  transition: `transform ${transition}, visibility 0s`,
  "@supports": {
    "(height: 100dvh)": { height: "100dvh" },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transitionDelay: "0s",
      transitionDuration: "0.01ms",
    },
  },
  selectors: {
    [`${root}[data-side="left"] &`]: {
      left: 0,
      transform: "translateX(-100%)",
    },
    [`${root}[data-full-screen="true"] &`]: {
      width: "100vw",
      maxWidth: "none",
    },
    [`${root}[data-side="left"][data-state="open"] &`]: {
      transform: "translateX(0)",
    },
    [`${root}[data-side="right"] &`]: {
      right: 0,
      transform: "translateX(100%)",
    },
    [`${root}[data-side="right"][data-state="open"] &`]: {
      transform: "translateX(0)",
    },
    [`${root}[data-state="closed"] &`]: {
      visibility: "hidden",
      pointerEvents: "none",
      transition: `transform ${transition}, visibility 0s linear 320ms`,
    },
  },
});
