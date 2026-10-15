import { style, keyframes } from "@vanilla-extract/css";

import { colors } from "../../styles";

const spin = keyframes({
  to: {
    transform: "rotate(360deg)",
  },
});

export const spinner = style({
  flex: "0 0 auto",
  color: colors.text.secondary,
  animation: `${spin} 900ms linear infinite`,
});
