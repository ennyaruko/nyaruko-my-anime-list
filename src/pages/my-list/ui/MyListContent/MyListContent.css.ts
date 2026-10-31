import { style } from "@vanilla-extract/css";

import { colors, typography } from "@/shared/styles";

export const foundResult = style({
  ...typography.caption["2xs"],
  color: colors.text.primary,
});

export const resetFilters = style({
  ...typography.caption["2xs"],
  width: "14px",
  height: "14px",
  cursor: "pointer",
});
