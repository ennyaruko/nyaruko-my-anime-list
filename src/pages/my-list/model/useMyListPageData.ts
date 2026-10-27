import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { AccountState } from "@/entities/account";
import { filterOptionsProviderToken } from "@/entities/filters";
import { type MyListEntry, myListServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

export function useMyListPageData({ account, accountPending }: AccountState) {
  const userId = account?.id;
  const { accessToken } = useAuth();
  const listService = useAppService(myListServiceToken);
  const filterOptionsProvider = useAppService(filterOptionsProviderToken);

  const [isManualRefreshPending, setIsManualRefreshPending] = useState(false);

  const listQuery = useQuery({
    enabled: Boolean(accessToken && userId),
    queryKey: queryCacheConfig.families.userList.key(userId ?? ""),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, userId!, signal),
  });

  const filterOptionsQuery = useQuery({
    enabled: Boolean(userId),
    queryKey: queryCacheConfig.families.filters.key(userId ?? ""),
    queryFn: ({ signal }) => filterOptionsProvider.getFilterOptions(signal),
  });

  const refreshList = async () => {
    setIsManualRefreshPending(true);
    try {
      await listQuery.refetch();
    } finally {
      setIsManualRefreshPending(false);
    }
  };

  const entries = useMemo<MyListEntry[]>(
    () => listQuery.data?.flatMap(({ list }) => list) ?? [],
    [listQuery.data],
  );
  const isListPending =
    isManualRefreshPending ||
    (accountPending && !userId) ||
    (Boolean(userId) && listQuery.isPending && listQuery.data === undefined);

  return { userId, entries, refreshList, isListPending, filterOptionsQuery };
}
