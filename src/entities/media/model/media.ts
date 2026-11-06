/** A calendar date with optional AniList date parts. */
export type PartialDate = {
  /** Day of the month, when known. */
  day: null | number;
  /** Calendar year, when known. */
  year: null | number;
  /** Month number, when known. */
  month: null | number;
};

/** Status values for a media item in the current user's list. */
export type MediaListStatus =
  "PAUSED" | "CURRENT" | "DROPPED" | "PLANNING" | "REPEATING" | "COMPLETED";

/** Provider-neutral media data consumed by cards and search results. */
export type Media = {
  /** AniList media identifier. */
  id: number;
  /** Localized display title chosen from AniList title variants. */
  title: string;
  /** Tags assigned to this media. */
  tags: string[];
  /** Genres assigned to this media. */
  genres: string[];
  /** Whether the provider marks the media as adult content. */
  isAdult: boolean;
  /** Whether the authenticated user has marked this media as a favorite. */
  isFavorite: boolean;
  /** Current user's personal score, or null if this media is not in their list. */
  score: null | number;
  /** AniList format such as TV, MOVIE, or OVA. */
  format: null | string;
  /** Source material reported by AniList. */
  source: null | string;
  /** Current user's watched episode count, or null if not in their list. */
  progress: null | number;
  /** Episode duration in minutes. */
  duration: null | number;
  /** Total episode count, when available. */
  episodes: null | number;
  /** AniList popularity value. */
  popularity: null | number;
  /** Release season year. */
  seasonYear: null | number;
  /** User-list entry identifier for this media, or null when not in the list. */
  listEntryId: null | number;
  /** AniList banner image URL. */
  bannerImage: null | string;
  /** AniList description. */
  description: null | string;
  /** Provider's aggregate score out of 100. */
  averageScore: null | number;
  /** Release end date. */
  endDate: null | PartialDate;
  /** AniList release status, distinct from the user's list status. */
  releaseStatus: null | string;
  /** Release start date. */
  startDate: null | PartialDate;
  /** User's list status, or null when the media is not in their list. */
  status: null | MediaListStatus;
  /** Cover image URLs at different sizes. */
  coverImage: null | {
    large: null | string;
    preview: null | string;
  };
};
