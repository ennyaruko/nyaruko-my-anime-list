import type { AccountProfile, IdentityProvider } from "@/entities/auth";

import { getViewer } from "../api/client";

import {
  startAniListAuthorization,
  consumeAniListAuthorizationCallback,
} from "./oauth";

/**
 * Anti-corruption adapter: AniList OAuth/DTOs are translated into the
 * provider-neutral auth contract here, at the app integration boundary.
 */
export const aniListIdentityProvider: IdentityProvider = {
  id: "anilist",
  displayName: "AniList",
  beginAuthorization: startAniListAuthorization,
  consumeAuthorizationCallback: consumeAniListAuthorizationCallback,
  async getCurrentAccount(accessToken, signal): Promise<AccountProfile> {
    const viewer = await getViewer(accessToken, signal);
    return {
      id: String(viewer.id),
      username: viewer.name,
      profileUrl: viewer.siteUrl ?? null,
      avatarUrl: viewer.avatar?.large ?? viewer.avatar?.medium ?? null,
    };
  },
};
