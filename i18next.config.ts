import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: ["ru", "en"],

  extract: {
    outputFormat: "ts",
    defaultNS: "common",
    input: ["src/**/*.{ts,tsx}"],

    useTranslationNames: ["useTranslation"],

    output: "src/shared/i18n/locales/{{language}}/{{namespace}}.ts",
  },
});
