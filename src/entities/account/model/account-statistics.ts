import { createServiceToken } from "@/shared/lib";

export type AccountStatistics = {
  count: number;
  meanScore: number;
  minutesWatched: number;
  plannedMinutes: number;
  episodesWatched: number;
  tags: { label: string; value: number }[];
  genres: { label: string; value: number }[];
};

/** Port for loading the authenticated account's anime statistics. */
export interface AccountStatisticsProvider {
  getStatistics(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<AccountStatistics>;
}

export const accountStatisticsProviderToken =
  createServiceToken<AccountStatisticsProvider>("accountStatisticsProvider");
