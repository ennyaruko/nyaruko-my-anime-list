import { createTheme } from "@vanilla-extract/css";

import { themeVars } from "./contract.css";

export const lightTheme = createTheme(themeVars, {
  gradient: {
    backgroundImageFade: "linear-gradient(to bottom, #FFFFFF00 0%, #FFFFFFFF 100%)",
  },

  color: {
    brand: {
      darkBlue: "#445566",
    },

    table: {
      state1: "#4682B4",
      state2: "#79A9CF",
      state3: "#98C2E3",
    },

    border: {
      normal: "#DCDCDC",
      secondary: "#4B4B4B",
      secondaryHover: "#181818",
    },

    status: {
      info: "#1D78B7",
      warning: "#F4AF30",
      positive: "#3CCE7B",
      negative: "#CE523C",
    },

    text: {
      info: "#81CFEA",
      action: "#176093",
      primary: "#000000",
      warning: "#FF8A3C",
      tertiary: "#9DA2A8",
      positive: "#74D61F",
      negative: "#FC575E",
      secondary: "#4B4B4B",
      primaryOnLight: "#FFFFFF",
      secondaryHover: "#181818",
      primaryOpposite: "#FFFFFF",
    },

    background: {
      base: "#FFFFFF",
      neutral1: "#FFFFFFD9",
      elevation1: "#E8EBEF",
      elevation2: "#DCDFE3",
      neutral2: "#E8EBEF80",
      elevation1Info: "#E9F7FB",
      elevation1Hover: "#D2D2D2",
      elevation1Pressed: "#DCDCDC",
      elevation1Warning: "#FFE8D8",
      elevation1Positive: "#E7F6D6",
      elevation1Negative: "#FFDDDF",
    },
  },
});
