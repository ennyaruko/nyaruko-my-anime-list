import type { Media, PartialDate, MediaListStatus } from "@/entities/media";

import { mapAniListCoverUrl } from "./cover-image";
import type {
  MediaDetailQuery,
  MediaRelationsQuery,
  MediaRecommendationsQuery,
} from "./generated/graphql";

type AniListDetailMedia = NonNullable<MediaDetailQuery["Media"]>;
type AniListRelatedMedia = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<MediaRelationsQuery["Media"]>["relations"]
      >["edges"]
    >[number]
  >["node"]
>;
type AniListRecommendedMedia = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<MediaRecommendationsQuery["Media"]>["recommendations"]
      >["nodes"]
    >[number]
  >["mediaRecommendation"]
>;

type AniListMedia =
  AniListDetailMedia | AniListRelatedMedia | AniListRecommendedMedia;

/** Maps AniList media records used by detail, relations, and recommendations. */
export function mapAniListMedia(media: AniListMedia): Media {
  const listEntry = media.mediaListEntry;
  const title = media.title;
  const coverImage = media.coverImage;

  return {
    tags: [],
    id: media.id,
    format: media.format ?? null,
    score: listEntry?.score ?? null,
    listEntryId: listEntry?.id ?? null,
    releaseStatus: media.status ?? null,
    seasonYear: media.seasonYear ?? null,
    averageScore: media.averageScore ?? null,
    status: mapListStatus(listEntry?.status),
    source: "source" in media ? (media.source ?? null) : null,
    endDate: "endDate" in media ? mapDate(media.endDate) : null,
    duration: "duration" in media ? (media.duration ?? null) : null,
    episodes: "episodes" in media ? (media.episodes ?? null) : null,
    startDate: "startDate" in media ? mapDate(media.startDate) : null,
    popularity: "popularity" in media ? (media.popularity ?? null) : null,
    title: title?.english || title?.romaji || title?.native || "Untitled",
    bannerImage: "bannerImage" in media ? (media.bannerImage ?? null) : null,
    description: "description" in media ? (media.description ?? null) : null,
    isAdult:
      "isAdult" in media && typeof media.isAdult === "boolean"
        ? media.isAdult
        : false,
    progress:
      listEntry?.progress ??
      (listEntry?.status === "CURRENT" || listEntry?.status === "REPEATING"
        ? 0
        : null),
    genres:
      "genres" in media && Array.isArray(media.genres)
        ? media.genres.filter(
            (genre): genre is string => typeof genre === "string",
          )
        : [],
    coverImage: coverImage
      ? {
          preview: mapAniListCoverUrl(coverImage.medium),
          large: mapAniListCoverUrl(
            "extraLarge" in coverImage
              ? (coverImage.extraLarge ?? coverImage.large)
              : coverImage.large,
          ),
        }
      : null,
  };
}

function mapListStatus(
  status: null | undefined | "REPEATING" | MediaListStatus,
): Media["status"] {
  if (status === "REPEATING") return "CURRENT";
  if (
    status === "CURRENT" ||
    status === "COMPLETED" ||
    status === "PAUSED" ||
    status === "DROPPED" ||
    status === "PLANNING"
  ) {
    return status;
  }

  return null;
}

function mapDate(
  date: null | {
    day?: null | number;
    year: null | number;
    month?: null | number;
  },
): null | PartialDate {
  return date
    ? {
        year: date.year,
        day: date.day ?? null,
        month: date.month ?? null,
      }
    : null;
}
