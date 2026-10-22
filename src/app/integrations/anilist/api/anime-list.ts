import type { MyListEntry, MyListStatus } from "@/entities/my-list";

import { ViewerAnimeListDocument } from "./queries";
import { createAniListGraphQLClient } from "./client";
import type { ViewerAnimeListQuery } from "./generated/graphql";

type AniListGroup = NonNullable<
  NonNullable<ViewerAnimeListQuery["MediaListCollection"]>["lists"]
>[number];
type AniListNonNullGroup = NonNullable<AniListGroup>;
type AniListEntry = NonNullable<
  NonNullable<AniListNonNullGroup["entries"]>[number]
>;

/** Provider-specific GraphQL request. DTO mapping stays inside this integration. */
export async function getViewerAnimeList(
  accessToken: string,
  userId: number,
  signal?: AbortSignal,
) {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    document: ViewerAnimeListDocument,
    variables: { userId, type: "ANIME" },
  });
  return (response.MediaListCollection?.lists ?? [])
    .filter((group) => group !== null)
    .map((group) => ({
      status: (group.status ?? "PLANNING") as MyListStatus,
      list: (group.entries ?? [])
        .filter((entry): entry is AniListEntry => entry !== null)
        .map(mapAniListMyListEntry),
    }));
}

export function mapAniListMyListEntry(entry: AniListEntry): MyListEntry {
  const media = entry.media;
  if (!media) {
    throw new Error("AniList entry is missing media data");
  }

  const status = entry.status as MyListStatus;

  return {
    status,
    id: media.id,
    score: entry.score ?? null,
    format: media.format ?? null,
    source: media.source ?? null,
    duration: media.duration ?? null,
    progress: entry.progress ?? null,
    episodes: media.episodes ?? null,
    seasonYear: media.seasonYear ?? null,
    bannerImage: media.bannerImage ?? null,
    description: media.description ?? null,
    averageScore: media.averageScore ?? null,
    title:
      media.title?.english ||
      media.title?.romaji ||
      media.title?.native ||
      "Untitled",
    coverImage: {
      large: media.coverImage?.large ?? null,
      preview: media.coverImage?.medium ?? null,
    },
    genres:
      media.genres?.filter(
        (genre: null | string): genre is string => genre !== null,
      ) ?? [],
    endDate: media.endDate
      ? {
          day: media.endDate.day,
          year: media.endDate.year,
          month: media.endDate.month,
        }
      : null,
    startDate: media.startDate
      ? {
          day: media.startDate.day,
          year: media.startDate.year,
          month: media.startDate.month,
        }
      : null,
  };
}
