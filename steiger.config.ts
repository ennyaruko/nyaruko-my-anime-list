import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: [
      "src/app/integrations/**/*",
      "src/app/services/**/*",
      "src/app/providers/**/*"
    ],
  },
  {
    rules: {
      "fsd/inconsistent-naming": 'off',
      "fsd/insignificant-slice": "off"
    },
  },
]);
