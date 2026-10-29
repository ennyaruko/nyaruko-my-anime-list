import { createGistEndpointResolver } from "@/shared/lib/remote-endpoints";

/** Unpinned raw URL follows future revisions of this configuration. */
const GIST_CONFIG_URL =
  "https://gist.githubusercontent.com/Nyar1othotep/db157de01d95d0ea10e5d7dd236462ac/raw/app-config.json";

export const remoteEndpoints = createGistEndpointResolver({
  gistUrl: GIST_CONFIG_URL,
  defaults: {
    animeApiAniList: "aHR0cHM6Ly9hbmltZWFwaS5teS5pZC9hbmlsaXN0LzphbmlsaXN0SWQ=",
    translation:
      "aHR0cHM6Ly90cmFuc2xhdGUuZ29vZ2xlYXBpcy5jb20vdHJhbnNsYXRlX2Evc2luZ2xl",
    shikimoriScreenshots:
      "aHR0cHM6Ly9zaGlraW1vcmkuaW8vYXBpL2FuaW1lcy86c2hpa2ltb3JpSWQvc2NyZWVuc2hvdHM=",
  },
});
