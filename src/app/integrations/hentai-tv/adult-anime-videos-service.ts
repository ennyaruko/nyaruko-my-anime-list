import type {
  AdultVideo,
  AdultAnimeVideosService,
} from "@/entities/adult-anime";

import type { RemoteConfigResolver } from "@/shared/lib/remote-endpoints";

import type { HentaiTvVideo } from "./schema";
import { searchResponseSchema } from "./schema";

function resolveAsset(path: string, origin: string): string {
  const url = new URL(path, origin);
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

function mapVideo(video: HentaiTvVideo, origin: string): null | AdultVideo {
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
    cover: resolveAsset(video.cover, origin),
    thumbnail: resolveAsset(video.thumb, origin),
  };
}

export function createHentaiTvAdultAnimeVideosService(
  config: RemoteConfigResolver,
  fetcher: typeof fetch = fetch,
): AdultAnimeVideosService {
  return {
    async searchByTitle(title, signal) {
      const baseUrl = await config.resolve("hentaiTvApi");
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
        const mapped = mapVideo(video, apiBaseUrl.origin);
        return mapped ? [mapped] : [];
      });
    },
  };
}
