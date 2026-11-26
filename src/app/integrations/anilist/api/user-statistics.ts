import { parse } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

import type {
  AccountStatistics,
  AccountStatisticsProvider,
} from "@/entities/account";

import { createAniListGraphQLClient } from "./client";
import viewerStatisticsQuery from "./operations/viewer-statistics.graphql?raw";

type ViewerStatisticsQuery = {
  Viewer?: null | {
    statistics?: null | {
      anime?: null | {
        count: number;
        meanScore: number;
        minutesWatched: number;
        episodesWatched: number;
        genres?: null | Array<null | {
          count: number;
          genre?: null | string;
        }>;
        statuses?: null | Array<null | {
          status?: null | string;
          minutesWatched: number;
        }>;
        tags?: null | Array<null | {
          count: number;
          tag?: null | { name?: null | string };
        }>;
      };
    };
  };
};

const ViewerStatisticsDocument = parse(
  viewerStatisticsQuery,
) as TypedDocumentNode<ViewerStatisticsQuery, Record<string, never>>;

type AniListStatistics = NonNullable<
  NonNullable<
    NonNullable<ViewerStatisticsQuery["Viewer"]>["statistics"]
  >["anime"]
>;

/** Requests the AniList user statistics and maps them to the account model. */
export async function getViewerStatistics(
  accessToken: string,
  signal?: AbortSignal,
): Promise<AccountStatistics> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    variables: {},
    document: ViewerStatisticsDocument,
  });
  const anime = response.Viewer?.statistics?.anime;

  if (!anime) {
    throw new Error("AniList did not return anime statistics for the viewer.");
  }

  return mapAniListStatistics(anime);
}

function mapAniListStatistics(
  statistics: AniListStatistics,
): AccountStatistics {
  return {
    count: statistics.count,
    meanScore: statistics.meanScore,
    minutesWatched: statistics.minutesWatched,
    episodesWatched: statistics.episodesWatched,
    plannedMinutes:
      statistics.statuses?.find((item) => item?.status === "PLANNING")
        ?.minutesWatched ?? 0,
    genres: (statistics.genres ?? [])
      .flatMap((item) =>
        item?.genre ? [{ label: item.genre, value: item.count }] : [],
      )
      .sort((first, second) => second.value - first.value),
    tags: (statistics.tags ?? [])
      .flatMap((item) =>
        item?.tag?.name ? [{ value: item.count, label: item.tag.name }] : [],
      )
      .sort((first, second) => second.value - first.value),
  };
}

export const aniListAccountStatisticsProvider: AccountStatisticsProvider = {
  getStatistics: getViewerStatistics,
};
