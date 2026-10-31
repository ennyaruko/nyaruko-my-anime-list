import { style, globalStyle } from "@vanilla-extract/css";

export const root = style({});

globalStyle(`.${root}, .${root} .ptr__children`, {
  height: "auto",
  overflow: "visible !important",
});
