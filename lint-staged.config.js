export default {
  "**/*.{json,jsonc,md,mdx,yml,yaml,css,scss,html}": [
    "prettier --write",
  ],

  "src/shared/i18n/locales/**/*.{json,jsonc,yml,yaml}": [
    () => "npm run locales:remove",
  ],

  "src/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": [
    () => "npm run locales:remove",
    "prettier --write",
    "eslint --fix",
    () => "npm run steiger",
  ],
};