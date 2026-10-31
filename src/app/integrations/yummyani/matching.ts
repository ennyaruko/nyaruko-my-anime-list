import type { MediaDetail } from "@/entities/media";

import type { YummyAnime } from "./schema";

export function normalizeTitle(title: string) {
  return title
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function seasonNumbers(title: string) {
  const roman: Record<string, string> = {
    v: "5",
    ii: "2",
    iv: "4",
    vi: "6",
    ix: "9",
    x: "10",
    iii: "3",
    vii: "7",
    viii: "8",
  };
  return title
    .split(" ")
    .flatMap((word) =>
      /^\d+$/.test(word) ? [word] : roman[word] ? [roman[word]] : [],
    )
    .join(",");
}

/** Metadata cannot compensate for an unrelated title or a conflicting explicit season. */
export function scoreAnimeMatch(
  detail: MediaDetail,
  candidate: YummyAnime,
): number {
  const malId = detail.malId;
  const remoteId =
    candidate.remote_ids?.myanimelist_id || candidate.remote_ids?.shikimori_id;
  if (malId && remoteId) return malId === remoteId ? 1000 : -1;
  const titles = (
    detail.titles?.length ? detail.titles : [detail.media.title]
  ).map(normalizeTitle);
  const alternatives = [candidate.title, ...(candidate.other_titles ?? [])].map(
    normalizeTitle,
  );
  let titleScore = 0;
  for (const title of titles) {
    for (const other of alternatives) {
      if (!title || !other) continue;
      if (title === other) {
        titleScore = 100;
        continue;
      }
      if (seasonNumbers(title) !== seasonNumbers(other)) continue;
      const left = new Set(title.split(" "));
      const right = new Set(other.split(" "));
      const overlap = [...left].filter((word) => right.has(word)).length;
      const similarity = overlap / Math.max(left.size, right.size);
      if (similarity >= 0.8 && overlap >= 3)
        titleScore = Math.max(titleScore, 70);
    }
  }
  if (titleScore < 70) return -1;
  let score = titleScore;
  const year = detail.media.seasonYear ?? detail.media.startDate?.year;
  if (year && candidate.year) {
    const gap = Math.abs(year - candidate.year);
    if (gap > 1) return -1;
    score += gap === 0 ? 40 : 10;
  }
  const formats: Record<string, string> = {
    TV: "tv",
    OVA: "ova",
    ONA: "ona",
    MOVIE: "movie",
    SPECIAL: "special",
    TV_SHORT: "shorttv",
  };
  const format = detail.media.format ? formats[detail.media.format] : undefined;
  if (format && candidate.type?.alias) {
    if (format !== candidate.type.alias) return -1;
    score += 15;
  }
  if (detail.media.episodes && candidate.episodes?.count) {
    score += detail.media.episodes === candidate.episodes.count ? 25 : -15;
  }
  return score;
}

export function selectAnimeMatch(
  detail: MediaDetail,
  candidates: YummyAnime[],
): null | YummyAnime {
  const ranked = [
    ...new Map(candidates.map((item) => [item.anime_id, item])).values(),
  ]
    .map((item) => ({ item, score: scoreAnimeMatch(detail, item) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score < 100) return null;
  if (ranked[1] && best.score - ranked[1].score < 15) return null;
  return best.item;
}
