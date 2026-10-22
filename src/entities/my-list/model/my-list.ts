import { createServiceToken } from "@/shared/lib";

export type MyListStatus =
  "PAUSED" | "CURRENT" | "DROPPED" | "PLANNING" | "COMPLETED";

export type PartialDate = {
  day: null | number;
  year: null | number;
  month: null | number;
};

export type MyListEntry = {
  /** Media Id */
  id: number;
  /** Media title */
  title: string;
  /** Media genres */
  genres: string[];
  /** Media status by user */
  status: MyListStatus;
  /** Media score by user */
  score: null | number;
  /** Media format */
  format: null | string;
  /** Media source */
  source: null | string;
  /** Media duration */
  duration: null | number;
  /** Viewing progress by user */
  progress: null | number;
  /** Media episodes */
  episodes: null | number;
  /** Media season year */
  seasonYear: null | number;
  /** Media banner image */
  bannerImage: null | string;
  /** Media description */
  description: null | string;
  /** Media average score */
  averageScore: null | number;
  /** Media end date */
  endDate: null | PartialDate;
  /** Media start date */
  startDate: null | PartialDate;
  /** Media cover image */
  coverImage: null | {
    large: null | string;
    preview: null | string;
  };
};

export type MyListEntries = {
  list: MyListEntry[];
  status: MyListStatus;
};

export type MyListCollection = MyListEntries[];

export type MyListService = {
  getMyList(
    accessToken: string,
    userId: string,
    signal?: AbortSignal,
  ): Promise<MyListCollection>;
};

export const myListServiceToken =
  createServiceToken<MyListService>("myListService");
