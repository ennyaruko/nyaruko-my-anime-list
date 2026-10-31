import type { IdentityProvider } from "@/entities/auth";

import {
  startAniListAuthorization,
  consumeAniListAuthorizationCallback,
} from "./oauth";

/** AniList-specific OAuth adapter; account data is fetched by its own provider. */
export const aniListIdentityProvider: IdentityProvider = {
  id: "anilist",
  displayName: "AniList",
  beginAuthorization: startAniListAuthorization,
  consumeAuthorizationCallback: consumeAniListAuthorizationCallback,
};
