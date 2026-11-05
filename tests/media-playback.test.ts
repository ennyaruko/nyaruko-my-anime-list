import { it, expect, describe } from "vitest";

import type { YummyVideo } from "../src/app/integrations/yummyani/schema";
import type { MediaDetail } from "../src/entities/media/model/media-detail";
import { selectAnimeMatch } from "../src/app/integrations/yummyani/matching";
import {
  mapCatalog,
  groupPlayers,
  commentMarkup,
} from "../src/app/integrations/yummyani/mapper";
import {
  initialPlaybackEpisode,
  progressAfterEpisodeChange,
  progressAfterWatchPageExit,
  statusAfterPlaybackProgress,
} from "../src/entities/media/model/media-playback";

const detail = {
  malId: 100,
  titles: ["A long anime title"],
  media: {
    id: 1,
    format: "TV",
    episodes: 12,
    seasonYear: 2024,
    title: "A long anime title",
  },
} as MediaDetail;
const video = (number: string, player = 1, dubbing = "First"): YummyVideo => ({
  number,
  views: 0,
  video_id: 1,
  iframe_url: "//example.com/embed",
  data: { dubbing, player_id: player, player: `Player ${player}` },
});

describe("watch progress", () => {
  it("does not count any non-final episode on page exit", () => {
    for (let episode = 1; episode < 12; episode++) {
      expect(progressAfterWatchPageExit(episode - 1, episode, 12)).toBe(
        episode - 1,
      );
    }
    expect(progressAfterWatchPageExit(11, 1, 12)).toBe(11);
    expect(progressAfterWatchPageExit(0, 12, 12)).toBe(0);
    expect(progressAfterWatchPageExit(11, 12, null)).toBe(11);
  });
  it("counts 12 on exit only after progress 11, completing a watching entry", () => {
    const progress = progressAfterWatchPageExit(11, 12, 12);
    expect(progress).toBe(12);
    expect(statusAfterPlaybackProgress("CURRENT", progress, 12)).toBe(
      "COMPLETED",
    );
    expect(statusAfterPlaybackProgress("REPEATING", progress, 12)).toBe(
      "COMPLETED",
    );
    expect(progressAfterWatchPageExit(progress, 12, 12)).toBe(12);
    expect(progressAfterWatchPageExit(0, 1, 1)).toBe(1);
  });
  it("still counts ordinary episodes on forward navigation and updates their status", () => {
    const progress = progressAfterEpisodeChange(0, 1, 2);
    expect(progress).toBe(1);
    for (const status of [
      null,
      "PLANNING",
      "PAUSED",
      "DROPPED",
      "COMPLETED",
    ] as const)
      expect(statusAfterPlaybackProgress(status, progress, 12)).toBe("CURRENT");
    expect(statusAfterPlaybackProgress("CURRENT", progress, 12)).toBe(
      "CURRENT",
    );
    expect(statusAfterPlaybackProgress("REPEATING", progress, 12)).toBe(
      "REPEATING",
    );
  });
  it("starts after saved progress and clamps completed titles", () => {
    expect(initialPlaybackEpisode(2, 12)).toBe(3);
    expect(initialPlaybackEpisode(12, 12)).toBe(12);
    expect(initialPlaybackEpisode(0, null)).toBe(1);
  });
  it("marks the episode left on a forward jump without marking skipped episodes", () => {
    expect(progressAfterEpisodeChange(2, 3, 6)).toBe(3);
    expect(progressAfterEpisodeChange(5, 3, 6)).toBe(5);
    expect(progressAfterEpisodeChange(2, 3, 2)).toBe(2);
    expect(progressAfterEpisodeChange(2, 3, 3)).toBe(2);
    expect(progressAfterEpisodeChange(2, 3.5, 4)).toBe(2);
  });
});

describe("catalog mapping", () => {
  it("groups players and tracks, sorts actual episode numbers, removes duplicates and unsafe URLs", () => {
    const result = groupPlayers([
      video("2"),
      video("1"),
      video("1"),
      video("1", 1, "Second"),
      video("1", 2),
      video("trailer"),
      { ...video("3"), iframe_url: "javascript:alert(1)" },
    ]);
    expect(result.map((p) => p.id)).toEqual(["1", "2"]);
    expect(result[0].tracks.map((t) => t.id)).toEqual(["First", "Second"]);
    expect(result[0].tracks[0].episodes.map((e) => e.number)).toEqual([1, 2]);
    expect(result[0].tracks[0].episodes[0].url).toBe(
      "https://example.com/embed",
    );
  });
  it("preserves previous seasons and the full viewing order", () => {
    const order = [1, 2, 3].map((id) => ({
      anime_id: id,
      title: String(id),
      data: { index: id },
    }));
    expect(
      mapCatalog({
        anime_id: 2,
        title: "Current",
        viewing_order: order,
      }).order.map((i) => i.id),
    ).toEqual(["1", "2", "3"]);
  });
  it("escapes comment HTML before rendering supported markup", () => {
    const result = commentMarkup('<img src=x onerror="alert(1)">[b]text[/b]');
    expect(result).not.toContain("<img");
    expect(result).toContain("<strong>text</strong>");
    expect(commentMarkup("[ник]User[/ник] привет")).toBe(
      "<strong>@User</strong> привет",
    );
  });
});

describe("anime matching", () => {
  it("prefers an exact external ID over a title and rejects conflicting IDs", () => {
    const exact = {
      anime_id: 5,
      title: "Another language",
      remote_ids: { myanimelist_id: 100 },
    };
    const wrong = {
      anime_id: 6,
      title: detail.media.title,
      remote_ids: { myanimelist_id: 200 },
    };
    expect(selectAnimeMatch(detail, [wrong, exact])).toEqual(exact);
    expect(selectAnimeMatch(detail, [wrong])).toBeNull();
  });
  it("rejects ambiguous titles and different seasons", () => {
    const candidate = { year: 2024, anime_id: 5, title: detail.media.title };
    expect(
      selectAnimeMatch(detail, [candidate, { ...candidate, anime_id: 6 }]),
    ).toBeNull();
    expect(
      selectAnimeMatch(detail, [
        { ...candidate, title: `${candidate.title} 2` },
      ]),
    ).toBeNull();
    expect(selectAnimeMatch(detail, [{ ...candidate, year: 2020 }])).toBeNull();
    expect(
      selectAnimeMatch(detail, [
        { ...candidate, title: `${candidate.title} II` },
      ]),
    ).toBeNull();
    expect(selectAnimeMatch(detail, [candidate])).toEqual(candidate);
  });
});
