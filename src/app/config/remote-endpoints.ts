import { createGistEndpointResolver } from "@/shared/lib/remote-endpoints";

/** Unpinned raw URL follows future revisions of this configuration. */
const GIST_CONFIG_URL =
  "https://gist.githubusercontent.com/Nyar1othotep/db157de01d95d0ea10e5d7dd236462ac/raw/app-config.json";

export const remoteEndpoints = createGistEndpointResolver({
  gistUrl: GIST_CONFIG_URL,
  defaultValues: {
    yummyApplication: "dWgydzgtbnN4dmkzeDgyNQ==",
  },
  defaults: {
    yummyApi: {
      fallbacks: [],
      default: "aHR0cHM6Ly9hcGkueWFuaS50di8=",
    },
    hentaiTvApi: {
      fallbacks: [],
      default: "aHR0cHM6Ly9oZW50YWkudHYvYXBpLw==",
    },
    getMalId: {
      default: null,
      fallbacks: ["aHR0cHM6Ly9hbmltZWFwaS5teS5pZC9hbmlsaXN0LzphbmlsaXN0SWQ="],
    },
    playerAniembedSub: {
      fallbacks: [],
      default: "aHR0cHM6Ly9hbmllbWJlZC5zZS9lLzphbmlsaXN0SWQvOmVwaXNvZGU=",
    },
    playerVidnestSub: {
      fallbacks: [],
      default:
        "aHR0cHM6Ly92aWRuZXN0LmZ1bi9hbmltZS86YW5pbGlzdElkLzplcGlzb2RlL3N1Yg==",
    },
    playerAniembedDub: {
      fallbacks: [],
      default:
        "aHR0cHM6Ly9hbmllbWJlZC5zZS9lLzphbmlsaXN0SWQvOmVwaXNvZGU/bGFuZz1kdWI=",
    },
    playerAnixoSub: {
      fallbacks: [],
      default:
        "aHR0cHM6Ly9hbml4by5idXp6L2VtYmVkL2FuaS86YW5pbGlzdElkLzplcGlzb2RlL3N1Yg==",
    },
    screenshots: {
      fallbacks: [],
      default:
        "aHR0cHM6Ly9zaGlraW1vcmkuaW8vYXBpL2FuaW1lcy86c2hpa2ltb3JpSWQvc2NyZWVuc2hvdHM=",
    },
    playerAnixoDub: {
      fallbacks: [],
      default:
        "aHR0cHM6Ly9hbml4by5idXp6L2VtYmVkL2FuaS86YW5pbGlzdElkLzplcGlzb2RlP3RyYWNrPWR1Yg==",
    },
    playerKodikRu: {
      fallbacks: [],
      default:
        "aHR0cHM6Ly9rb2Rpay55ZG5zLmV1Lz9zaGlraW1vcmlJRD06c2hpa2ltb3JpSWQmd2lkdGg9MTAwJSZoZWlnaHQ9MTAwJSZub0VtYmVk",
    },
    translation: {
      fallbacks: ["aHR0cHM6Ly9hcGkubXltZW1vcnkudHJhbnNsYXRlZC5uZXQvZ2V0"],
      default:
        "aHR0cHM6Ly90cmFuc2xhdGUuZ29vZ2xlYXBpcy5jb20vdHJhbnNsYXRlX2Evc2luZ2xl",
    },
  },
});
