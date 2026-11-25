import { createServiceToken } from "@/shared/lib";

import type { AdultVideo } from "./adult-video";

export type AdultAnimeVideosService = {
  searchByTitle(title: string, signal?: AbortSignal): Promise<AdultVideo[]>;
};

export type AdultVideoSource = "hentai-tv" | "mucho-hentai";

export const adultAnimeVideosServiceToken =
  createServiceToken<AdultAnimeVideosService>("adultAnimeVideosService");

export const muchoHentaiAdultAnimeVideosServiceToken =
  createServiceToken<AdultAnimeVideosService>(
    "muchoHentaiAdultAnimeVideosService",
  );
