import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import {
  type AccountProfile,
  accountStatisticsProviderToken,
} from "@/entities/account";

import { useAppService, queryCacheConfig } from "@/shared/lib";

export function useAccountStatistics(account: undefined | AccountProfile) {
  const { accessToken } = useAuth();
  const provider = useAppService(accountStatisticsProviderToken);
  const userId = account?.id ?? "";

  return useQuery({
    meta: { required: true },
    enabled: Boolean(accessToken && userId),
    queryKey: queryCacheConfig.families.accountStatistics.key(userId),
    queryFn: ({ signal }) => provider.getStatistics(accessToken!, signal),
  });
}
