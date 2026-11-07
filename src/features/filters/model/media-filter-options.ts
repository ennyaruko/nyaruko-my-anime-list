import type {
  MediaSortKey,
  MediaFormatFilter,
  MediaSourceFilter,
  MediaStatusFilter,
} from "@/entities/filters";

import type { CalendarYearRange } from "@/shared/model";

export type YearFilterOption = {
  value: string;
  label: string;
  range: CalendarYearRange;
};

export type YearFilterLabelKey =
  | "before1980"
  | "decade2010s"
  | "decade2000s"
  | "decade1990s"
  | "decade1980s"
  | "decade1970s";

export function getYearFilterOptions(
  currentYear = new Date().getFullYear(),
  translate: (key: YearFilterLabelKey) => string = (key) => key,
): YearFilterOption[] {
  const options = Array.from(
    { length: Math.max(0, currentYear + 1 - 2015 + 1) },
    (_, index) => currentYear + 1 - index,
  ).map((year) => ({
    value: String(year),
    label: String(year),
    range: { toYear: year, fromYear: year },
  }));

  return [
    ...options,
    {
      value: "2010s",
      label: translate("decade2010s"),
      range: { toYear: 2014, fromYear: 2010 },
    },
    {
      value: "2000s",
      label: translate("decade2000s"),
      range: { toYear: 2009, fromYear: 2000 },
    },
    {
      value: "1990s",
      label: translate("decade1990s"),
      range: { toYear: 1999, fromYear: 1990 },
    },
    {
      value: "1980s",
      label: translate("decade1980s"),
      range: { toYear: 1989, fromYear: 1980 },
    },
    {
      value: "1970s",
      label: translate("decade1970s"),
      range: { toYear: 1979, fromYear: 1970 },
    },
    {
      value: "before1980",
      label: translate("before1980"),
      range: { toYear: 1979, fromYear: null },
    },
  ];
}

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
