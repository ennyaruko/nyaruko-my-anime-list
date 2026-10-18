import { createServiceToken } from "@/shared/lib/app-services";

export type AnimeListEntry = {
  id: number;
  title: string;
  score: number;
  animeId: number;
  progress: number;
  genres: string[];
  year: null | number;
  format: null | string;
  coverUrl: null | string;
  status: AnimeListStatus;
  episodes: null | number;
  averageScore: null | number;
};

export type AnimeListStatus =
  | "PAUSED"
  | "CURRENT"
  | "DROPPED"
  | "UNKNOWN"
  | "PLANNING"
  | "COMPLETED"
  | "REPEATING";

export type AnimeListService = {
  getAnimeList(
    accessToken: string,
    userId: string,
    signal?: AbortSignal,
  ): Promise<AnimeListEntry[]>;
};

export const animeListServiceToken =
  createServiceToken<AnimeListService>("animeListService");
