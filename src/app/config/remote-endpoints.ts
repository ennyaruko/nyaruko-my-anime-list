import { createGistEndpointResolver } from "@/shared/lib";

/** Raw URL for the current app configuration Gist revision. */
const GIST_CONFIG_URL =
  "https://gist.githubusercontent.com/ennyaruko/e1ba27025c47c683f35b8060937bc4fd/raw/bd8c77fa90fdbde2da761c8ba1c929d6b3bc05a6/app-config.json";

export const remoteEndpoints = createGistEndpointResolver({
  gistUrl: GIST_CONFIG_URL,
});
