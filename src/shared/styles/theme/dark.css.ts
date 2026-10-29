import { createTheme } from "@vanilla-extract/css";

import { themeVars } from "./contract.css";

export const darkTheme = createTheme(themeVars, {
  gradient: {
    backgroundImageFade:
      "linear-gradient(to bottom, #15171900 0%, #151719FF 100%)",
  },

  color: {
    table: {
      state1: "#5A98C9",
      state2: "#73A3D3",
      state3: "#8CC8E0",
    },

    border: {
      normal: "#3A4046",
      secondary: "#707880",
      secondaryHover: "#B5BCC3",
    },

    brand: {
      darkBlue: "#718699",
      darkBlueHover: "#889AAB",
      darkBluePressed: "#617C94",
    },

    status: {
      info: "#4AA5D9",
      warning: "#F7BB43",
      positive: "#49D8AB",
      negative: "#E96A54",
    },

    text: {
      info: "#81CFEA",
      action: "#5EA9DD",
      primary: "#FFFFFF",
      warning: "#FF9852",
      feature: "#B775F6",
      tertiary: "#8F969E",
      positive: "#7FE02A",
      negative: "#FF6B72",
      secondary: "#BEC4CA",
      primaryOnLight: "#FFFFFF",
      secondaryHover: "#FFFFFF",
      primaryOpposite: "#000000",
    },

    background: {
      base: "#222",
      elevation1: "#333",
      neutral1: "#2A2A2AD9",
      elevation2: "#3B3B3B",
      neutral2: "#4E4E4E1A",
      elevation1Info: "#19313B",
      elevation1Hover: "#3B3B3B",
      overlay: "rgb(0 0 0 / 78%)",
      elevation1Pressed: "#292929",
      elevation1Warning: "#35291C",
      elevation1Feature: "#352940",
      elevation1Positive: "#183022",
      elevation1Negative: "#371F23",
    },
  },
});
