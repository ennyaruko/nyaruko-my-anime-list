import { style, styleVariants } from "@vanilla-extract/css";

export const wide = style({ width: "100%" });

export const tall = style({ height: "100%" });

export const wrap = style({ flexWrap: "wrap" });

export const direction = styleVariants({
  row: { flexDirection: "row" },
  column: { flexDirection: "column" },
  "row-reverse": { flexDirection: "row-reverse" },
  "column-reverse": { flexDirection: "column-reverse" },
});

export const alignItem = styleVariants({
  start: { alignItems: "start" },
  center: { alignItems: "center" },
  stretch: { alignItems: "stretch" },
  "flex-start": { alignItems: "flex-start" },
});

export const justifyContent = styleVariants({
  center: { justifyContent: "center" },
  "flex-start": { justifyContent: "flex-start" },
  "space-between": { justifyContent: "space-between" },
});
