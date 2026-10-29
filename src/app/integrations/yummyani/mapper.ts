import type {
  PlaybackPlayer,
  PlaybackCatalog,
  PlaybackComment,
} from "@/entities/media";

import {
  detailSchema,
  httpsResource,
  commentSchema,
  type YummyVideo,
} from "./schema";

export function groupPlayers(videos: YummyVideo[]): PlaybackPlayer[] {
  const players = new Map<string, PlaybackPlayer>();
  for (const video of videos) {
    const number = Number(video.number);
    const url = httpsResource(video.iframe_url);
    if (!url || !Number.isFinite(number) || number <= 0) continue;
    const id = String(video.data.player_id);
    let player = players.get(id);
    if (!player) {
      player = { id, tracks: [], name: video.data.player };
      players.set(id, player);
    }
    let track = player.tracks.find((item) => item.id === video.data.dubbing);
    if (!track) {
      track = {
        views: 0,
        episodes: [],
        id: video.data.dubbing,
        name: video.data.dubbing,
      };
      player.tracks.push(track);
    }
    const existingEpisode = track.episodes.find(
      (item) => item.number === number,
    );
    if (!existingEpisode) {
      track.episodes.push({ url, number, label: String(video.number) });
      track.views += video.views;
    }
  }
  for (const player of players.values()) {
    for (const track of player.tracks) {
      track.episodes.sort((a, b) => a.number - b.number);
    }
    player.tracks.sort((a, b) => {
      const aIsSubtitle = /субтитр|\bsubtitles?\b|\bsubs?\b/i.test(a.name);
      const bIsSubtitle = /субтитр|\bsubtitles?\b|\bsubs?\b/i.test(b.name);
      if (aIsSubtitle !== bIsSubtitle) return aIsSubtitle ? 1 : -1;
      return b.views - a.views;
    });
  }
  return [...players.values()];
}

export function mapCatalog(payload: unknown): PlaybackCatalog {
  const anime = detailSchema.parse(payload);
  const order = [...(anime.viewing_order ?? [])].sort(
    (a, b) => (a.data?.index ?? 0) - (b.data?.index ?? 0),
  );
  const position = order.findIndex((item) => item.anime_id === anime.anime_id);
  const next = position >= 0 ? order : [anime, ...order];
  return {
    title: anime.title,
    id: String(anime.anime_id),
    episodes: anime.episodes?.count || null,
    players: groupPlayers(anime.videos ?? []),
    order: next.map((item) => ({
      title: item.title,
      year: item.year ?? null,
      id: String(item.anime_id),
      format: item.type?.shortname ?? "",
      description:
        "data" in item ? (item.data?.text ?? "") : (anime.original ?? ""),
      status:
        item.anime_status?.alias === "released"
          ? "released"
          : item.anime_status?.alias === "ongoing"
            ? "ongoing"
            : "announcement",
    })),
  };
}

/** Escape user HTML before interpreting the small supported BBCode vocabulary. */
export function commentMarkup(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /\[(?:ник|nick)\]([\s\S]*?)\[\/(?:ник|nick)\]/gi,
      "<strong>@$1</strong>",
    )
    .replace(/\[(?:ж|b)\]([\s\S]*?)\[\/(?:ж|b)\]/gi, "<strong>$1</strong>")
    .replace(/\[(?:к|i)\]([\s\S]*?)\[\/(?:к|i)\]/gi, "<em>$1</em>")
    .replace(/\[(?:з|s)\]([\s\S]*?)\[\/(?:з|s)\]/gi, "<del>$1</del>")
    .replace(
      /\[(?:спойлер|spoiler)(?:=[^\]]*)?\]([\s\S]*?)\[\/(?:спойлер|spoiler)\]/gi,
      "<details><summary>Спойлер</summary><p>$1</p></details>",
    )
    .replace(
      /\[(?:quote|цитата)(?:=[^\]]*)?\]([\s\S]*?)\[\/(?:quote|цитата)\]/gi,
      "<blockquote>$1</blockquote>",
    );
}

export function mapComments(payload: unknown): PlaybackComment[] {
  const object = payload as null | { comments?: unknown };
  if (!object || !Array.isArray(object.comments))
    throw new Error("Invalid comments response");
  return object.comments.flatMap((value) => {
    const parsed = commentSchema.safeParse(value);
    if (!parsed.success || parsed.data.deleted_at) return [];
    const item = parsed.data;
    return [
      {
        author: item.name,
        likes: item.likes,
        id: String(item.id),
        dislikes: item.dislikes,
        createdAt: item.time * 1000,
        replies: item.children_count,
        body: commentMarkup(item.text),
        avatar: httpsResource(item.avatars?.small),
      },
    ];
  });
}
