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

/** A media relation and its provider-neutral summary. */
export type MediaRelation = {
  /** Related anime shown in the detail page. */
  media: Media;
  /** AniList relation label, such as PREQUEL or SEQUEL. */
  type: null | string;
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
};
