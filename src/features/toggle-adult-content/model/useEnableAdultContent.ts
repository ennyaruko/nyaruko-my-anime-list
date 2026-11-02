import { useTranslation } from "react-i18next";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { AccountProfile } from "@/entities/account";
import { accountProviderToken } from "@/entities/account";

import { showNotification } from "@/shared/ui";
import { useAppService, queryCacheConfig } from "@/shared/lib";

export function useEnableAdultContent() {
  const { t } = useTranslation(["common"]);
  const { sessionId, accessToken, identityProvider } = useAuth();
  const accountProvider = useAppService(accountProviderToken);
  const queryClient = useQueryClient();
  const queryKey = queryCacheConfig.families.account.key(
    identityProvider.id,
    sessionId,
  );
  const mutation = useMutation({
    meta: { errorNotifier: () => null },
    onError: () => {
      showNotification(t("common:notify.adultContentEnableFailed"), "error");
    },
    onSuccess: async (enabled) => {
      queryClient.setQueryData<AccountProfile>(queryKey, (account) =>
        account ? { ...account, adultContentEnabled: enabled } : account,
      );
      await queryClient.invalidateQueries({ queryKey });
    },
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error("An authenticated account session is required.");
      }

      const enabled = await accountProvider.setAdultContentEnabled(
        accessToken,
        true,
      );
      if (!enabled) {
        throw new Error("The account provider did not enable adult content.");
      }
      return enabled;
    },
  });

  return {
    enable: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
