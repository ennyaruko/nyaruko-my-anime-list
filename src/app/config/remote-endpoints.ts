import { createGistEndpointResolver } from "@/shared/lib";

/** Unpinned raw URL follows future revisions of this configuration. */
const GIST_CONFIG_URL =
  "https://gist.githubusercontent.com/ennyaruko/e1ba27025c47c683f35b8060937bc4fd/raw/app-config.json";

export const remoteEndpoints = createGistEndpointResolver({
  gistUrl: GIST_CONFIG_URL,
});
