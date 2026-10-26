import type {
  MediaSortKey,
  MediaFormatFilter,
  MediaSourceFilter,
  MediaStatusFilter,
} from "@/entities/filters";

export const statusFilterOptions = [
  { label: "announced", value: "NOT_YET_RELEASED" },
  { value: "RELEASING", label: "releasing" },
  { value: "FINISHED", label: "finished" },
  { value: "CANCELLED", label: "cancelled" },
] as const satisfies { label: string; value: MediaStatusFilter }[];

export const formatFilterOptions = [
  { value: "TV", label: "tv" },
  { label: "tvShort", value: "TV_SHORT" },
  { value: "MOVIE", label: "movie" },
  { value: "SPECIAL", label: "special" },
  { value: "OVA", label: "ova" },
  { value: "ONA", label: "ona" },
  { value: "MUSIC", label: "music" },
] as const satisfies { label: string; value: MediaFormatFilter }[];

export const sourceFilterOptions = [
  { value: "ORIGINAL", label: "original" },
  { value: "MANGA", label: "manga" },
  { label: "lightNovel", value: "LIGHT_NOVEL" },
  { label: "visualNovel", value: "VISUAL_NOVEL" },
  { label: "videoGame", value: "VIDEO_GAME" },
  { value: "OTHER", label: "other" },
  { value: "NOVEL", label: "novel" },
  { value: "DOUJINSHI", label: "doujinshi" },
  { value: "COMIC", label: "comic" },
  { label: "liveAction", value: "LIVE_ACTION" },
  { value: "GAME", label: "game" },
  { label: "multimediaProject", value: "MULTIMEDIA_PROJECT" },
  { label: "pictureBook", value: "PICTURE_BOOK" },
  { value: "ANIME", label: "anime" },
  { label: "webNovel", value: "WEB_NOVEL" },
] as const satisfies { label: string; value: MediaSourceFilter }[];

export const listSortOptions: MediaSortKey[] = [
  "releaseDate",
  "popularity",
  "averageScore",
  "score",
  "title",
  "startDate",
  "completedDate",
  "lastUpdated",
  "lastAdded",
  "progress",
];

export const searchSortOptions: MediaSortKey[] = [
  "releaseDate",
  "popularity",
  "averageScore",
  "title",
];

export const allStatusValues = statusFilterOptions.map(({ value }) => value);
export const allFormatValues = formatFilterOptions.map(({ value }) => value);
export const allSourceValues = sourceFilterOptions.map(({ value }) => value);
