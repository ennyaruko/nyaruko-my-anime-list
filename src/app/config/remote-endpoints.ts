import { createGistEndpointResolver } from "@/shared/lib/remote-endpoints";

/** Unpinned raw URL follows future revisions of this configuration. */
const GIST_CONFIG_URL =
  "https://gist.githubusercontent.com/Nyar1othotep/db157de01d95d0ea10e5d7dd236462ac/raw/app-config.json";

export const remoteEndpoints = createGistEndpointResolver({
  gistUrl: GIST_CONFIG_URL,
  defaults: {
    translation: "https://translate.googleapis.com/translate_a/single",
  },
});
