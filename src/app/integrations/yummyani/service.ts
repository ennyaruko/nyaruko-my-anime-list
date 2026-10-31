import { z } from "zod";

import type {
  MediaDetail,
  CommentSort,
  MediaScreenshot,
} from "@/entities/media";

import { selectAnimeMatch } from "./matching";
import type { YummyApiConfig } from "./client";
import { mapCatalog, mapComments } from "./mapper";
import { YummyApiError, createYummyClient } from "./client";
import {
  animeSchema,
  videoSchema,
  detailSchema,
  httpsResource,
  type YummyAnime,
} from "./schema";

const matchSchema = z.object({
  expiresAt: z.number(),
  signature: z.string(),
  id: z.number().nullable(),
});

export function createYummyService(
  yummyConfig: YummyApiConfig,
  fetcher: typeof fetch = fetch,
) {
  const request = createYummyClient(yummyConfig, fetcher);
  async function getDetail(id: string, signal: AbortSignal) {
    return detailSchema.parse(
      await request(
        `anime/${encodeURIComponent(id)}`,
        { need_videos: "true" },
        signal,
      ),
    );
  }

  async function findAnime(
    detail: MediaDetail,
    signal: AbortSignal,
  ): Promise<null | number> {
    if (detail.malId) {
      const exact = z
        .array(animeSchema)
        .parse(
          await request(
            "anime",
            { limit: "10", mal_ids: String(detail.malId) },
            signal,
          ),
        );
      const match = selectAnimeMatch(detail, exact);
      if (match) return match.anime_id;
    }
    const titles = [
      ...new Set(detail.titles?.length ? detail.titles : [detail.media.title]),
    ]
      .filter(Boolean)
      .slice(0, 3);
    const candidates = new Map<number, YummyAnime>();
    const hydrated = new Set<number>();
    for (const title of titles) {
      const results = z
        .array(animeSchema)
        .parse(await request("anime", { q: title, limit: "10" }, signal));
      for (const item of results)
        if (!candidates.has(item.anime_id)) candidates.set(item.anime_id, item);
      let match = selectAnimeMatch(detail, [...candidates.values()]);
      if (match) return match.anime_id;
      // Search results may omit aliases. Inspect a bounded number of plausible candidates.
      const year = detail.media.seasonYear ?? detail.media.startDate?.year;
      for (const item of results
        .filter(
          (item) => !year || !item.year || Math.abs(year - item.year) <= 1,
        )
        .slice(0, 3)) {
        if (hydrated.size >= 6 || hydrated.has(item.anime_id)) continue;
        hydrated.add(item.anime_id);
        const candidate = animeSchema.parse(
          await request(`anime/${item.anime_id}`, {}, signal),
        );
        candidates.set(candidate.anime_id, candidate);
      }
      match = selectAnimeMatch(detail, [...candidates.values()]);
      if (match) return match.anime_id;
    }
    return null;
  }

  return {
    getDetail,
    async getReplies(id: string, signal: AbortSignal) {
      return mapComments(
        await request(
          `comments/${encodeURIComponent(id)}/children`,
          {},
          signal,
        ),
      );
    },
    async getComments(
      id: string,
      sort: CommentSort,
      offset: number,
      signal: AbortSignal,
    ) {
      const payload = z
        .object({ comments: z.array(z.unknown()) })
        .parse(
          await request(
            `comments/anime/${encodeURIComponent(id)}`,
            { sort, limit: "20", skip: String(offset) },
            signal,
          ),
        );
      return {
        items: mapComments(payload),
        nextOffset: payload.comments.length === 20 ? offset + 20 : null,
      };
    },
    async getScreenshots(
      detail: MediaDetail,
      signal: AbortSignal,
    ): Promise<MediaScreenshot[]> {
      const animeId = await findAnime(detail, signal);
      if (animeId === null) return [];
      const anime = detailSchema.parse(
        await request(`anime/${animeId}`, { need_videos: "false" }, signal),
      );
      return (anime.random_screenshots ?? []).flatMap(({ sizes }) => {
        const preview = httpsResource(sizes?.small ?? sizes?.full);
        const original = httpsResource(sizes?.full ?? sizes?.small);
        return preview && original ? [{ preview, original }] : [];
      });
    },
    async getCatalog(detail: MediaDetail, signal: AbortSignal) {
      const key = `playback-match:v1:${detail.media.id}`;
      const signature = JSON.stringify([
        detail.malId,
        detail.titles,
        detail.media.title,
        detail.media.seasonYear,
      ]);
      let cached: undefined | z.infer<typeof matchSchema>;
      try {
        const result = matchSchema.safeParse(
          JSON.parse(localStorage.getItem(key) ?? "null"),
        );
        if (
          result.success &&
          result.data.expiresAt > Date.now() &&
          result.data.signature === signature
        )
          cached = result.data;
      } catch {
        /* Storage can be unavailable in private browsing or SSR. */
      }
      if (cached?.id === null) return null;
      let id = cached?.id ?? (await findAnime(detail, signal));
      let anime;
      if (id !== null) {
        try {
          anime = await getDetail(String(id), signal);
        } catch (error) {
          if (
            !cached ||
            !(error instanceof YummyApiError) ||
            error.status !== 404
          )
            throw error;
          id = await findAnime(detail, signal);
          if (id !== null) anime = await getDetail(String(id), signal);
        }
      }
      signal.throwIfAborted();
      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            id,
            signature,
            expiresAt: Date.now() + (id === null ? 3_600_000 : 7 * 86_400_000),
          }),
        );
      } catch {
        /* Matching also works without persistence. */
      }
      if (!anime) return null;
      if (!anime.videos?.length)
        anime.videos = z
          .array(videoSchema)
          .parse(await request(`anime/${anime.anime_id}/videos`, {}, signal));
      return mapCatalog(anime);
    },
  };
}
