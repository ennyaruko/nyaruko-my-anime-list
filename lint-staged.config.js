export default {
  "**/*.{json,jsonc,md,mdx,yml,yaml,css,scss,html}": [
    "prettier --write",
  ],

 "src/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": [
    "prettier --write",
    "eslint --fix",
  ],

  "src/shared/i18n/locales/**/*.{ts,json,jsonc,yml,yaml}": [
    () => "npm run locales:check",
  ],
};