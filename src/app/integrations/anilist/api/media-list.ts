import type { MyListEntry, MyListStatus } from "@/entities/media";

import { mapAniListCoverUrl } from "./cover-image";
import { ViewerMediaListDocument } from "./queries";
import { createAniListGraphQLClient } from "./client";
import type { ViewerMediaListQuery } from "./generated/graphql";

type AniListGroup = NonNullable<
  NonNullable<ViewerMediaListQuery["MediaListCollection"]>["lists"]
>[number];
type AniListNonNullGroup = NonNullable<AniListGroup>;
type AniListEntry = NonNullable<
  NonNullable<AniListNonNullGroup["entries"]>[number]
>;

/** Provider-specific GraphQL request. DTO mapping stays inside this integration. */
export async function getViewerMediaList(
  accessToken: string,
  userId: number,
  signal?: AbortSignal,
) {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    document: ViewerMediaListDocument,
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
    createdAt: entry.createdAt ?? 0,
    updatedAt: entry.updatedAt ?? 0,
    isAdult: media.isAdult ?? false,
    duration: media.duration ?? null,
    progress: entry.progress ?? null,
    episodes: media.episodes ?? null,
    releaseStatus: media.status ?? null,
    popularity: media.popularity ?? null,
    seasonYear: media.seasonYear ?? null,
    bannerImage: media.bannerImage ?? null,
    description: media.description ?? null,
    averageScore: media.averageScore ?? null,
    tags: media.tags?.flatMap((tag) => (tag?.name ? [tag.name] : [])) ?? [],
    title:
      media.title?.english ||
      media.title?.romaji ||
      media.title?.native ||
      "Untitled",
    genres:
      media.genres?.filter(
        (genre: null | string): genre is string => genre !== null,
      ) ?? [],
    coverImage: {
      large: mapAniListCoverUrl(media.coverImage?.large),
      preview: mapAniListCoverUrl(media.coverImage?.medium),
    },
    endDate: media.endDate
      ? {
          day: media.endDate.day,
          year: media.endDate.year,
          month: media.endDate.month,
        }
      : null,
    startedAt: entry.startedAt
      ? {
          day: entry.startedAt.day,
          year: entry.startedAt.year,
          month: entry.startedAt.month,
        }
      : null,
    startDate: media.startDate
      ? {
          day: media.startDate.day,
          year: media.startDate.year,
          month: media.startDate.month,
        }
      : null,
    completedAt: entry.completedAt
      ? {
          day: entry.completedAt.day,
          year: entry.completedAt.year,
          month: entry.completedAt.month,
        }
      : null,
  };
}
