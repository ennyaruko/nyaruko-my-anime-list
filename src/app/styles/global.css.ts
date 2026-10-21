import { globalStyle } from "@vanilla-extract/css";

import { colors } from "@/shared/styles";

globalStyle("*", {
  margin: 0,
  padding: 0,
  outline: "none",
  boxSizing: "border-box",
});

globalStyle("html, body", {
  minWidth: "100%",
  minHeight: "100%",
  fontSynthesis: "none",
  fontFamily: "Inter, sans-serif",
  textRendering: "optimizeLegibility",
});

globalStyle("body", {
  minHeight: "100svh",
});

globalStyle("button, input, textarea, select", {
  border: "none",
  font: "inherit",
  background: "none",
});

globalStyle(".app", {
  minWidth: "100%",
  minHeight: "100svh",
  backgroundColor: colors.background.base,
});
