import svgr from "@svgr/rollup";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    svgr(),
    vanillaExtractPlugin({
      identifiers: ({ hash }) => `anime_${hash}`,
    }),
  ],
});
