import type {
  AdultVideo,
  AdultAnimeVideosService,
} from "@/entities/adult-anime";

import type { RemoteConfigResolver } from "@/shared/lib/remote-endpoints";

import type { HentaiTvVideo } from "./schema";
import { searchResponseSchema } from "./schema";

const HENTAI_TV_ORIGIN = "https://hentai.tv";

function resolveAsset(path: string): string {
  const url = new URL(path, HENTAI_TV_ORIGIN);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Invalid hentai.tv image URL");
  }
  return url.href;
}

function isValidEmbedUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function mapVideo(video: HentaiTvVideo): null | AdultVideo {
  if (!isValidEmbedUrl(video.embedUrl)) return null;

  return {
    id: video.id,
    year: video.year,
    tags: video.tags,
    episode: video.ep,
    title: video.title,
    rating: video.rating,
    quality: video.quality,
    censored: video.censored,
    language: video.language,
    duration: video.duration,
    embedUrl: video.embedUrl,
    cover: resolveAsset(video.cover),
    thumbnail: resolveAsset(video.thumb),
  };
}

export function createHentaiTvAdultAnimeVideosService(
  config: RemoteConfigResolver,
  fetcher: typeof fetch = fetch,
): AdultAnimeVideosService {
  return {
    async searchByTitle(title, signal) {
      const baseUrl = await config.resolve("hentaiTvProxy");
      const apiBaseUrl = new URL(`${baseUrl.replace(/\/$/, "")}/`);
      const url = new URL("search", apiBaseUrl);
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
        throw new Error(`hentai.tv search failed: ${response.status}`);
      }

      const payload: unknown = await response.json();
      const result = searchResponseSchema.parse(payload);
      return result.videos.flatMap((video) => {
        const mapped = mapVideo(video);
        return mapped ? [mapped] : [];
      });
    },
  };
}
