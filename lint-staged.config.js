export default {
  "src/**/*.{js,jsx,ts,tsx}": () => "npm run steiger",
  "**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": "eslint --fix",
};
