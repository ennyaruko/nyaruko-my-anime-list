/** Sort modes available to media list and search surfaces. */
export type MediaSortKey =
  | "score"
  | "title"
  | "progress"
  | "startDate"
  | "lastAdded"
  | "popularity"
  | "releaseDate"
  | "lastUpdated"
  | "averageScore"
  | "completedDate";

/** AniList release statuses available as filter choices. */
export type MediaStatusFilter =
  "FINISHED" | "RELEASING" | "CANCELLED" | "NOT_YET_RELEASED";

/** AniList media formats available as filter choices. */
export type MediaFormatFilter =
  "TV" | "OVA" | "ONA" | "MOVIE" | "MUSIC" | "SPECIAL" | "TV_SHORT";

/** Source materials available as filter choices. */
export type MediaSourceFilter =
  | "GAME"
  | "MANGA"
  | "OTHER"
  | "NOVEL"
  | "COMIC"
  | "ANIME"
  | "ORIGINAL"
  | "DOUJINSHI"
  | "WEB_NOVEL"
  | "VIDEO_GAME"
  | "LIGHT_NOVEL"
  | "LIVE_ACTION"
  | "VISUAL_NOVEL"
  | "PICTURE_BOOK"
  | "MULTIMEDIA_PROJECT";

/** Whether selected values are included directly or excluded from all values. */
export type FilterSelectionMode = "include" | "exclude";

/** User-configurable filter values shared by media list and search. */
export type MediaFiltersState = {
  /** Selected AniList tags. */
  tags: string[];
  /** Selected genres. */
  genres: string[];
  /** Selected ordering. */
  sort: MediaSortKey;
  /** Selected AniList formats. */
  formats: MediaFormatFilter[];
  /** Selected source materials. */
  sources: MediaSourceFilter[];
  /** Selected AniList release statuses. */
  statuses: MediaStatusFilter[];
  /** Include or exclude behavior for release status selections. */
  statusMode: FilterSelectionMode;
  /** Include or exclude behavior for format selections. */
  formatMode: FilterSelectionMode;
  /** Include or exclude behavior for source selections. */
  sourceMode: FilterSelectionMode;
};
