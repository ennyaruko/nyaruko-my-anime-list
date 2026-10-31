import { style } from "@vanilla-extract/css";

import { colors, primitives, typography } from "../../styles";

export const toastContainer = style({
  ...typography.body.s,
  vars: {
    "--toastify-toast-bd-radius": "0",
    "--toastify-toast-min-height": "40px",

    "--toastify-color-info": colors.status.info,
    "--toastify-color-error": colors.status.negative,
    "--toastify-color-warning": colors.status.warning,
    "--toastify-color-success": colors.status.positive,

    "--toastify-font-family": typography.body.s.fontFamily,
    "--toastify-toast-padding": `${primitives.spacing.xs} ${primitives.spacing.l}`,
  },
});
