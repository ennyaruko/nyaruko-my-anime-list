import { createServiceToken } from "@/shared/lib/app-services";

import type { MediaListStatus } from "./media";
import type { MediaDetail } from "./media-detail";

export type PlaybackEpisode = { url: string; label: string; number: number };
export type PlaybackTrack = {
  id: string;
  name: string;
  views: number;
  episodes: PlaybackEpisode[];
};
export type PlaybackPlayer = {
  id: string;
  name: string;
  tracks: PlaybackTrack[];
};
export type PlaybackOrderItem = {
  id: string;
  title: string;
  format: string;
  year: null | number;
  description: string;
  status: "ongoing" | "released" | "announcement";
};
export type PlaybackCatalog = {
  id: string;
  title: string;
  episodes: null | number;
  players: PlaybackPlayer[];
  order: PlaybackOrderItem[];
};
export type EmbedPlayer = {
  id: string;
  name: string;
  mode: "dub" | "sub";
  urlTemplate: string;
  language: "ru" | "en";
  /** null for providers that explicitly reject sandboxed embeds. */
  sandbox?: null | string;
  supportsEpisodes: boolean;
};
export type PlaybackComment = {
  id: string;
  body: string;
  likes: number;
  author: string;
  replies: number;
  dislikes: number;
  createdAt: number;
  avatar: null | string;
};
export type CommentSort = "new" | "old" | "nice";
export type PlaybackCommentsPage = {
  items: PlaybackComment[];
  nextOffset: null | number;
};

/** Provider-neutral contract used by the watch page. */
export type MediaPlaybackService = {
  getReplies(id: string, signal: AbortSignal): Promise<PlaybackComment[]>;
  resolveMediaId(id: string, signal: AbortSignal): Promise<null | number>;
  getCatalog(
    detail: MediaDetail,
    signal: AbortSignal,
  ): Promise<null | PlaybackCatalog>;
  getEmbedPlayers(
    mediaId: number,
    malId: null | number,
    signal: AbortSignal,
  ): Promise<EmbedPlayer[]>;
  getComments(
    id: string,
    sort: CommentSort,
    offset: number,
    signal: AbortSignal,
  ): Promise<PlaybackCommentsPage>;
};

export const mediaPlaybackServiceToken =
  createServiceToken<MediaPlaybackService>("mediaPlaybackService");

/** Only an explicit forward selection marks the episode being left as watched. */
export function progressAfterEpisodeChange(
  progress: number,
  current: number,
  next: number,
) {
  return next > current && Number.isInteger(current)
    ? Math.max(progress, current)
    : progress;
}

export function initialPlaybackEpisode(progress: number, total: null | number) {
  return Math.max(
    1,
    Math.min(progress + 1, total && total > 0 ? total : Infinity),
  );
}

/** Only the anime's final episode can be counted by leaving its watch page. */
export function progressAfterWatchPageExit(
  progress: number,
  current: number,
  total: null | number,
) {
  return total !== null &&
    Number.isInteger(total) &&
    total > 0 &&
    current === total &&
    progress === total - 1
    ? progress + 1
    : progress;
}

export function statusAfterPlaybackProgress(
  status: null | MediaListStatus,
  progress: number,
  total: null | number,
): MediaListStatus {
  if (status === "REPEATING") return status;
  if (status === "CURRENT" && total !== null && total > 0 && progress === total)
    return "COMPLETED";
  return "CURRENT";
}
