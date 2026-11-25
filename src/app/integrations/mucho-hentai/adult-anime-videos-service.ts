import type {
  AdultVideo,
  AdultAnimeVideosService,
} from "@/entities/adult-anime";

import type { RemoteConfigResolver } from "@/shared/lib/remote-endpoints";

import { searchResponseSchema } from "./schema";
import type { MuchoHentaiVideo } from "./schema";

const PARSER_ENDPOINT = "muchoHentaiParser";
const SEARCH_PATH = "search";

function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function mapVideo(video: MuchoHentaiVideo): null | AdultVideo {
  if (
    !isValidHttpsUrl(video.embedUrl) ||
    !isValidHttpsUrl(video.cover) ||
    !isValidHttpsUrl(video.thumbnail)
  ) {
    return null;
  }

  return {
    id: video.id,
    year: video.year,
    tags: video.tags,
    title: video.title,
    cover: video.cover,
    rating: video.rating,
    episode: video.episode,
    quality: video.quality,
    language: video.language,
    duration: video.duration,
    embedUrl: video.embedUrl,
    censored: video.censored,
    thumbnail: video.thumbnail,
  };
}

export function createMuchoHentaiAdultAnimeVideosService(
  config: RemoteConfigResolver,
  fetcher: typeof fetch = fetch,
): AdultAnimeVideosService {
  return {
    async searchByTitle(title, signal) {
      const base = await config.resolve(PARSER_ENDPOINT);
      const baseUrl = base.endsWith("/") ? base : `${base}/`;
      const url = new URL(SEARCH_PATH, baseUrl);
      url.searchParams.set("q", title);

      const timeoutSignal = AbortSignal.timeout(12_000);
      const response = await fetcher(url, {
        credentials: "omit",
        headers: { Accept: "application/json" },
        signal: signal
          ? AbortSignal.any([signal, timeoutSignal])
          : timeoutSignal,
      });

      if (!response.ok) {
        throw new Error(`MuchoHentai search failed: ${response.status}`);
      }

      const result = searchResponseSchema.parse(await response.json());
      return result.videos.flatMap((video) => {
        const mapped = mapVideo(video);
        return mapped ? [mapped] : [];
      });
    },
  };
}
