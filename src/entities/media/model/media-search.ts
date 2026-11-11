import type { CalendarYearRange } from "@/shared/model";

import type { Media } from "./media";
import type { MediaContentMode } from "./media-visibility";

/** Search result ordering supported by the media search service. */
export type MediaSearchSort =
  "title" | "trending" | "popularity" | "releaseDate" | "averageScore";

/** Search and filtering options sent to a media search provider. */
export type MediaSearchParameters = {
  /** One-based result page. */
  page: number;
  /** Search text. */
  search: string;
  /** Selected tags. */
  tags: string[];
  /** Number of results requested per page. */
  perPage: number;
  /** Selected genres. */
  genres: string[];
  /** Selected media formats. */
  formats: string[];
  /** Selected media sources. */
  sources: string[];
  /** Selected AniList release statuses. */
  statuses: string[];
  /** Search result ordering. */
  sort: MediaSearchSort;
  /** Whether the selected formats should be sent to the provider. */
  formatFilterEnabled: boolean;
  /** Whether the selected sources should be sent to the provider. */
  sourceFilterEnabled: boolean;
  /** Whether the selected statuses should be sent to the provider. */
  statusFilterEnabled: boolean;
  /** Content category requested from the provider. */
  contentMode: MediaContentMode;
  /** Include or exclude behavior for tag selections. */
  tagsMode: "include" | "exclude";
  /** Include or exclude behavior for genre selections. */
  genresMode: "include" | "exclude";
  /** Optional calendar-year range. */
  yearRange?: null | CalendarYearRange;
};

/** A page of media returned by a search provider. */
export type MediaSearchResult = {
  /** Total matching result count when provided. */
  total: number;
  /** Media items returned for this page. */
  items: Media[];
  /** Whether the provider has another page of results. */
  hasNextPage: boolean;
};
