import { createServiceToken } from "@/shared/lib";

import type { AdultVideo } from "./adult-video";

export type AdultAnimeVideosService = {
  searchByTitle(title: string, signal?: AbortSignal): Promise<AdultVideo[]>;
};

export const adultAnimeVideosServiceToken =
  createServiceToken<AdultAnimeVideosService>("adultAnimeVideosService");
