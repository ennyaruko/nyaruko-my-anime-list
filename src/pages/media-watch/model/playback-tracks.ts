import type { PlaybackTrack, PlaybackCatalog } from "@/entities/media";

/** Merges duplicate tracks across players, keeping each track's best view count. */
export function getPlaybackTracks(catalog: PlaybackCatalog): PlaybackTrack[] {
  const tracks = new Map(
    catalog.players
      .flatMap((player) => player.tracks)
      .map((track) => [track.id, track]),
  );

  for (const player of catalog.players) {
    for (const candidate of player.tracks) {
      const current = tracks.get(candidate.id);
      if (current && candidate.views > current.views)
        tracks.set(candidate.id, candidate);
    }
  }

  return [...tracks.values()].sort((left, right) => {
    const leftIsSubtitle = /субтитр|\bsubtitles?\b|\bsubs?\b/i.test(left.name);
    const rightIsSubtitle = /субтитр|\bsubtitles?\b|\bsubs?\b/i.test(
      right.name,
    );
    if (leftIsSubtitle !== rightIsSubtitle) return leftIsSubtitle ? 1 : -1;
    return right.views - left.views;
  });
}
