import type {
  Media,
  MediaSearchResult,
  MediaSearchParameters,
} from "@/entities/media";

import { SearchMediaDocument } from "./queries";
import { mapAniListCoverUrl } from "./cover-image";
import { createAniListGraphQLClient } from "./client";
import type { SearchMediaQuery } from "./generated/graphql";
import type {
  MediaSort,
  MediaFormat,
  MediaSource,
  MediaStatus,
} from "./generated/graphql";

const searchSort: Record<MediaSearchParameters["sort"], MediaSort> = {
  title: "TITLE_ROMAJI",
  trending: "TRENDING_DESC",
  averageScore: "SCORE_DESC",
  popularity: "POPULARITY_DESC",
  releaseDate: "START_DATE_DESC",
};

type SearchMediaItem = NonNullable<
  NonNullable<NonNullable<SearchMediaQuery["Page"]>["media"]>[number]
>;

export async function searchAniListMedia(
  parameters: MediaSearchParameters,
  signal?: AbortSignal,
): Promise<MediaSearchResult> {
  const client = createAniListGraphQLClient();
  const response = await client.request({
    signal,
    document: SearchMediaDocument,
    variables: {
      page: parameters.page,
      perPage: parameters.perPage,
      isAdult: parameters.isAdult,
      sort: [searchSort[parameters.sort]],
      search: parameters.search || undefined,
      tagIn: parameters.tags.length > 0 ? parameters.tags : undefined,
      genreIn: parameters.genres.length > 0 ? parameters.genres : undefined,
      formatIn: parameters.formatFilterEnabled
        ? (parameters.formats as MediaFormat[])
        : undefined,
      sourceIn: parameters.sourceFilterEnabled
        ? (parameters.sources as MediaSource[])
        : undefined,
      statusIn: parameters.statusFilterEnabled
        ? (parameters.statuses as MediaStatus[])
        : undefined,
    },
  });

  const page = response.Page;
  return {
    total: page?.pageInfo?.total ?? 0,
    hasNextPage: page?.pageInfo?.hasNextPage ?? false,
    items: (page?.media ?? [])
      .filter((media): media is SearchMediaItem => media !== null)
      .map(mapAniListSearchMedia),
  };
}

function mapAniListSearchMedia(media: SearchMediaItem): Media {
  return {
    score: null,
    id: media.id,
    status: null,
    progress: null,
    listEntryId: null,
    format: media.format ?? null,
    source: media.source ?? null,
    isAdult: media.isAdult ?? false,
    episodes: media.episodes ?? null,
    duration: media.duration ?? null,
    releaseStatus: media.status ?? null,
    popularity: media.popularity ?? null,
    seasonYear: media.seasonYear ?? null,
    description: media.description ?? null,
    bannerImage: media.bannerImage ?? null,
    averageScore: media.averageScore ?? null,
    tags: media.tags?.flatMap((tag) => (tag ? [tag.name] : [])) ?? [],
    title:
      media.title?.english ||
      media.title?.romaji ||
      media.title?.native ||
      "Untitled",
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
    coverImage: media.coverImage
      ? {
          large: mapAniListCoverUrl(media.coverImage.large),
          preview: mapAniListCoverUrl(media.coverImage.medium),
        }
      : null,
  };
}
