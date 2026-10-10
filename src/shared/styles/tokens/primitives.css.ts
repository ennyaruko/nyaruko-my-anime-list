import { createGlobalTheme } from "@vanilla-extract/css";

/**
 * Non-semantic tokens. These do not change between color themes, so they are
 * defined globally on :root rather than behind a theme class.
 */
export const primitives = createGlobalTheme(":root", {
  blur: {
    sm: "7.5px",
  },

  radii: {
    md: "1.25rem",
    sm: "0.938rem",
  },

  zIndex: {
    modal: "1200",
    sticky: "1100",
    popover: "1300",
    tooltip: "1400",
    dropdown: "1000",
  },

  spacing: {
    s: "16px",
    m: "20px",
    l: "24px",
    xxs: "8px",
    xs: "12px",
    xl: "32px",
    tiny: "2px",
    xxxs: "4px",
    xxl: "48px",
    xxxl: "64px",
    huge: "128px",
  },

  shadow: {
    xs: "2px 2px 6px 0 #00000026",
    small: "0 0 20px 0 #0000001a",
    popup: "0 8px 28px 0 #00000029",
    medium: "0 6px 34px 0 #0000001f",
    smallHover: "0 14px 42px 0 #0000001f",
    mediumHover: "0 18px 60px 0 #0000002e",
  },
});
