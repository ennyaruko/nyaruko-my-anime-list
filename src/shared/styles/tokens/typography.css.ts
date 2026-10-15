import { createGlobalTheme } from "@vanilla-extract/css";

/**
 * Typography tokens from the supplied Figma reference.
 *
 * Figma's AUTO line-height is represented as CSS `normal` because the
 * reference does not expose a concrete line-height value.
 *
 * `heading.2xl` is kept at 400 because the supplied reference does not show
 * an explicit weight for that style.
 */
export const typography = createGlobalTheme(":root", {
  caption: {
    xs: {
      fontSize: "12px",
      fontWeight: "400",
      lineHeight: "15px",
      fontFamily: "Inter, sans-serif",
    },
    "2xs": {
      fontSize: "11px",
      fontWeight: "400",
      lineHeight: "13px",
      fontFamily: "Inter, sans-serif",
    },
    "2xs-medium": {
      fontSize: "11px",
      fontWeight: "500",
      lineHeight: "13px",
      fontFamily: "Inter, sans-serif",
    },
  },

  body: {
    m: {
      fontSize: "15px",
      fontWeight: "400",
      lineHeight: "18px",
      fontFamily: "Inter, sans-serif",
    },
    s: {
      fontSize: "13px",
      fontWeight: "400",
      lineHeight: "16px",
      fontFamily: "Inter, sans-serif",
    },
    "s-bold": {
      fontSize: "13px",
      fontWeight: "700",
      lineHeight: "16px",
      fontFamily: "Inter, sans-serif",
    },
    "s-medium": {
      fontSize: "13px",
      fontWeight: "500",
      lineHeight: "16px",
      fontFamily: "Inter, sans-serif",
    },
    "2xs-bold": {
      fontSize: "11px",
      fontWeight: "700",
      lineHeight: "13px",
      fontFamily: "Inter, sans-serif",
    },
  },

  heading: {
    "2xl": {
      fontSize: "20px",
      fontWeight: "400",
      lineHeight: "24px",
      fontFamily: "Inter, sans-serif",
    },
    "m-bold": {
      fontSize: "15px",
      fontWeight: "700",
      lineHeight: "18px",
      fontFamily: "Inter, sans-serif",
    },
    "m-medium": {
      fontSize: "15px",
      fontWeight: "500",
      lineHeight: "18px",
      fontFamily: "Inter, sans-serif",
    },
    "s-medium": {
      fontSize: "13px",
      fontWeight: "500",
      lineHeight: "16px",
      fontFamily: "Inter, sans-serif",
    },
    "xl-medium": {
      fontSize: "18px",
      fontWeight: "500",
      lineHeight: "22px",
      fontFamily: "Inter, sans-serif",
    },
    "3xl-medium": {
      fontSize: "24px",
      fontWeight: "500",
      lineHeight: "29px",
      fontFamily: "Inter, sans-serif",
    },
  },
});
