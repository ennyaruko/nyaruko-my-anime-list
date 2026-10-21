import svgr from "@svgr/rollup";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
   preview: {
    port: 5173,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    vanillaExtractPlugin({
      identifiers: ({ hash }) => `anime_${hash}`,
    }),
    reactRouter(),
    svgr(),
    
  ],
});
