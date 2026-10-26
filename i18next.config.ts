import { defineConfig } from "i18next-cli";

import { getDynamicKeyPatterns } from "./scripts/i18n-preserve-dynamic";

export default defineConfig({
  locales: ["ru", "en"],

  extract: {
    outputFormat: "ts",
    defaultNS: "common",

     input: ["src/**/*.{ts,tsx}"],
     
    useTranslationNames: ["useTranslation"],

    preservePatterns: getDynamicKeyPatterns(),

    output: "src/shared/i18n/locales/{{language}}/{{namespace}}.ts",
  },
});
