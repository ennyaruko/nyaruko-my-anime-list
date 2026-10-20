import { createServiceToken } from "@/shared/lib";

export type MyListEntry = {
  id: number;
  title: string;
  score: number;
  animeId: number;
  progress: number;
  genres: string[];
  year: null | number;
  status: MyListStatus;
  format: null | string;
  coverUrl: null | string;
  episodes: null | number;
  averageScore: null | number;
};

export type MyListStatus =
  | "PAUSED"
  | "CURRENT"
  | "DROPPED"
  | "UNKNOWN"
  | "PLANNING"
  | "COMPLETED"
  | "REPEATING";

export type MyListService = {
  getMyList(
    accessToken: string,
    userId: string,
    signal?: AbortSignal,
  ): Promise<MyListEntry[]>;
};

export const myListServiceToken =
  createServiceToken<MyListService>("myListService");
