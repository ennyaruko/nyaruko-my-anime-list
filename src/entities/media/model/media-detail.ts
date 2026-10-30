import type { Media } from "./media";

/** One user review published for a media item. */
export type MediaReview = {
  /** AniList review identifier. */
  id: number;
  /** Review creation time in Unix seconds. */
  createdAt: number;
  /** AniList review body rendered as HTML from its flavored Markdown. */
  body: null | string;
  /** Reviewer's score for the media, from 0 to 100. */
  score: null | number;
  /** Net community rating, used with ratingAmount to derive positive votes. */
  rating: null | number;
  /** Review summary shown before its Markdown body. */
  summary: null | string;
  /** Number of community ratings. */
  ratingAmount: null | number;
  /** Review author's public identity. */
  author: null | {
    /** Author name shown in the review header. */
    name: string;
    /** Author avatar URL. */
    avatarUrl: null | string;
  };
};

/** Relation kinds exposed by AniList for connected media. */
export type MediaRelationType =
  | "OTHER"
  | "PARENT"
  | "SEQUEL"
  | "SOURCE"
  | "PREQUEL"
  | "SUMMARY"
  | "CONTAINS"
  | "SPIN_OFF"
  | "CHARACTER"
  | "ADAPTATION"
  | "SIDE_STORY"
  | "ALTERNATIVE"
  | "COMPILATION"
  | "SAME_UNIVERSE";

/** A media relation and its provider-neutral summary. */
export type MediaRelation = {
  /** Related anime shown in the detail page. */
  media: Media;
  /** AniList relation label, such as PREQUEL or SEQUEL. */
  type: null | MediaRelationType;
};

/** Tag name and its AniList community rank, represented as a percentage. */
export type MediaTag = {
  /** Tag label. */
  name: string;
  /** Tag rank from 0 to 100. */
  rank: number;
};

/** One page of similar media returned by the AniList recommendations connection. */
export type MediaRecommendationsPage = {
  /** Provider page number used to fetch this result. */
  page: number;
  /** Media items included in the requested page. */
  items: Media[];
  /** Whether AniList reports another page after this one. */
  hasNextPage: boolean;
};

/** Core media page data returned by the persisted detail query. */
export type MediaDetail = {
  /** The main media record, including the current user's list entry. */
  media: Media;
  /** Community-ranked tags. */
  tags: MediaTag[];
  /** Original title variants for cross-catalog matching. */
  titles?: string[];
  /** AniList's MyAnimeList identifier, used before external ID lookups. */
  malId: null | number;
  /** Upcoming episode release times, expressed as Unix seconds. */
  airingSchedule: MediaAiringScheduleEntry[];
};

/** One upcoming episode and its scheduled release time. */
export type MediaAiringScheduleEntry = {
  episode: number;
  airingAt: number;
};
