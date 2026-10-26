import { copyFile } from "node:fs/promises";

const clientBuildDirectory = new URL("../build/client/", import.meta.url);

await copyFile(
  new URL("index.html", clientBuildDirectory),
  new URL("404.html", clientBuildDirectory),
);
