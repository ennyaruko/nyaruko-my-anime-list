import { style, keyframes } from "@vanilla-extract/css";

import { colors } from "../theme/contract.css";

const shimmer = keyframes({
  "0%": { backgroundPosition: "100% 0" },
  "100%": { backgroundPosition: "-100% 0" },
});

export const skeleton = style({
  backgroundSize: "200% 100%",
  animation: `${shimmer} 1.4s ease-in-out infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
  backgroundImage: `linear-gradient(90deg, ${colors.background.elevation1} 0%, ${colors.background.elevation2} 50%, ${colors.background.elevation1} 100%)`,
});
