import type { AccountProvider } from "@/entities/account";

import { getViewer } from "./api/client";

/** Maps AniList's Viewer DTO to the provider-neutral account profile model. */
export const aniListAccountProvider: AccountProvider = {
  async getCurrentAccount(accessToken, signal) {
    const viewer = await getViewer(accessToken, signal);
    return {
      id: String(viewer.id),
      username: viewer.name,
      profileUrl: viewer.siteUrl ?? null,
      avatarUrl: viewer.avatar?.large ?? viewer.avatar?.medium ?? null,
    };
  },
};
