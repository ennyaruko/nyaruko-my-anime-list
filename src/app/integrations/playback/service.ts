import type { EmbedPlayer, MediaPlaybackService } from "@/entities/media";

import type { RemoteConfigResolver } from "@/shared/lib/remote-endpoints";

import type { YummyApiConfig } from "../yummyani/client";
import { createYummyService } from "../yummyani/service";
import { createAniListGraphQLClient } from "../anilist/api/client";

import { kodikEmbedTemplate } from "./embed-url";

const embedSources = [
  { mode: "dub", name: "Anixo", sandbox: null, id: "playerAnixoDub" },
  { mode: "dub", name: "Aniembed", id: "playerAniembedDub" },
  { mode: "sub", name: "Anixo", sandbox: null, id: "playerAnixoSub" },
  { mode: "sub", sandbox: null, name: "Vidnest", id: "playerVidnestSub" },
  { mode: "sub", name: "Aniembed", id: "playerAniembedSub" },
] as const;

/** Composition of the catalog adapter and independently configured embed sources. */
export function createMediaPlaybackService(
  config: RemoteConfigResolver,
  yummyConfig: YummyApiConfig,
): MediaPlaybackService {
  const catalog = createYummyService(yummyConfig);
  return {
    getCatalog: catalog.getCatalog,
    getReplies: catalog.getReplies,
    getComments: catalog.getComments,
    async resolveMediaId(id, signal) {
      const anime = await catalog.getDetail(id, signal);
      const malId =
        anime.remote_ids?.myanimelist_id || anime.remote_ids?.shikimori_id;
      if (!malId) return null;
      const result = await createAniListGraphQLClient().request<{
        Media: null | { id: number };
      }>({
        signal,
        variables: { idMal: malId },
        document:
          "query PlaybackMediaId($idMal: Int!) { Media(idMal: $idMal, type: ANIME) { id } }",
      });
      return result.Media?.id ?? null;
    },
    async getEmbedPlayers(mediaId, malId, signal) {
      const sources = await Promise.allSettled(
        embedSources.map(async (source) => ({
          ...source,
          supportsEpisodes: true,
          language: "en" as const,
          urlTemplate: (await config.resolve(source.id)).replaceAll(
            ":anilistId",
            String(mediaId),
          ),
        })),
      );
      signal.throwIfAborted();
      const players: EmbedPlayer[] = sources.flatMap((item) =>
        item.status === "fulfilled" ? [item.value] : [],
      );
      if (malId) {
        try {
          const urlTemplate = (
            await config.resolve("playerKodikRu")
          ).replaceAll(":shikimoriId", String(malId));
          players.unshift({
            mode: "dub",
            name: "Kodik",
            language: "ru",
            id: "playerKodikRu",
            supportsEpisodes: false,
            urlTemplate: kodikEmbedTemplate(urlTemplate),
          });
        } catch {
          /* A disabled embed source does not disable the others. */
        }
      }
      signal.throwIfAborted();
      return players;
    },
  };
}
