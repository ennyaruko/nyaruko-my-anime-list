import { MyListEntry, MyListStatus } from "@/entities/my-list";

import { ViewerAnimeListDocument } from "./queries";
import { createAniListGraphQLClient } from "./client";

export type AniListMediaListEntryDto = {
  id: number;
  score: number;
  progress: number;
  status: null | string;
  media: {
    id: number;
    type: string;
    genres: string[];
    format: null | string;
    episodes: null | number;
    seasonYear: null | number;
    averageScore: null | number;
    coverImage: null | { large: null | string; medium: null | string };
    title: {
      romaji: null | string;
      native: null | string;
      english: null | string;
    };
  };
};

type AniListMediaListCollectionResponse = {
  MediaListCollection: null | {
    lists: Array<{
      name: null | string;
      status: null | string;
      entries: AniListMediaListEntryDto[];
    }>;
  };
};

/** Provider-specific GraphQL request. DTO mapping stays inside this integration. */
export async function getViewerAnimeList(
  accessToken: string,
  userId: number,
  signal?: AbortSignal,
): Promise<AniListMediaListEntryDto[]> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request<AniListMediaListCollectionResponse>({
    signal,
    document: ViewerAnimeListDocument,
    variables: { userId, type: "ANIME" },
  });
  return (
    response.MediaListCollection?.lists.flatMap(
      (list: { entries: AniListMediaListEntryDto[] }) => list.entries,
    ) ?? []
  );
}

export function mapAniListMyListEntry(
  entry: AniListMediaListEntryDto,
): MyListEntry {
  const media = entry.media;
  const allowedStatuses = new Set([
    "CURRENT",
    "PLANNING",
    "COMPLETED",
    "DROPPED",
    "PAUSED",
    "REPEATING",
  ]);
  const status =
    entry.status && allowedStatuses.has(entry.status)
      ? (entry.status as MyListStatus)
      : "UNKNOWN";

  return {
    status,
    id: entry.id,
    animeId: media.id,
    score: entry.score,
    format: media.format,
    genres: media.genres,
    year: media.seasonYear,
    progress: entry.progress,
    episodes: media.episodes,
    averageScore: media.averageScore,
    coverUrl: media.coverImage?.large ?? media.coverImage?.medium ?? null,
    title:
      media.title.english ||
      media.title.romaji ||
      media.title.native ||
      "Untitled",
  };
}
