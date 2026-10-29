import { createThemeContract } from "@vanilla-extract/css";

/**
 * Semantic values that can change with the active visual theme.
 * Components depend on this contract and never on light/dark literals.
 */
export const themeVars = createThemeContract({
  gradient: {
    backgroundImageFade: null,
  },

  color: {
    table: {
      state1: null,
      state2: null,
      state3: null,
    },

    border: {
      normal: null,
      secondary: null,
      secondaryHover: null,
    },

    brand: {
      primary: null,
      primaryHover: null,
      primaryPressed: null,
    },

    status: {
      info: null,
      warning: null,
      positive: null,
      negative: null,
    },

    text: {
      info: null,
      action: null,
      primary: null,
      warning: null,
      feature: null,
      tertiary: null,
      positive: null,
      negative: null,
      secondary: null,
      primaryOnLight: null,
      secondaryHover: null,
      primaryOpposite: null,
    },

    background: {
      base: null,
      overlay: null,
      neutral1: null,
      neutral2: null,
      elevation1: null,
      elevation2: null,
      elevation1Info: null,
      elevation1Hover: null,
      elevation1Pressed: null,
      elevation1Warning: null,
      elevation1Feature: null,
      elevation1Positive: null,
      elevation1Negative: null,
    },
  },
});

export const colors = themeVars.color;
export const gradients = themeVars.gradient;
