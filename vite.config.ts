import svgr from "@svgr/rollup";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

import { deploymentBaseUrl } from "./deployment.config.ts";

export default defineConfig(({ command }) => ({
  preview: {
    port: 5173,
  },
  resolve: {
    tsconfigPaths: true,
  },
  base: command === "build" ? deploymentBaseUrl : "/",
  plugins: [
    vanillaExtractPlugin({
      identifiers: ({ hash }) => `anime_${hash}`,
    }),
    reactRouter(),
    svgr(),
  ],
}));
