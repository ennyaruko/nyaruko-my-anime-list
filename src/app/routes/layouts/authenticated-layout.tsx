import { Outlet, Navigate } from "react-router";

import { useQuery, useIsRestoring } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { AccountState } from "@/entities/account";
import { accountProviderToken } from "@/entities/account";

import { Spinner } from "@/shared/ui";
import { useAppService, queryCacheConfig } from "@/shared/lib";

/**
 * Loads the current account once for the authenticated route branch. The query
 * cache, rather than the auth session or component state, owns the profile.
 */
export default function AuthenticatedLayout() {
  const { status, sessionId, accessToken, identityProvider } = useAuth();
  const accountProvider = useAppService(accountProviderToken);
  const isRestoring = useIsRestoring();

  const accountQuery = useQuery({
    enabled: status === "authenticated" && Boolean(accessToken && sessionId),
    queryKey: queryCacheConfig.families.account.key(
      identityProvider.id,
      sessionId,
    ),
    queryFn: ({ signal }) => {
      if (!accessToken) {
        throw new Error("Cannot load account without an access token");
      }
      return accountProvider.getCurrentAccount(accessToken, signal);
    },
  });

  if (status === "initializing" || isRestoring) {
    return (
      <main>
        <Spinner />
      </main>
    );
  }

  if (status === "anonymous") {
    return <Navigate replace to="/login" />;
  }

  return (
    <Outlet
      context={
        {
          account: accountQuery.data,
          accountError: accountQuery.isError,
          accountPending: accountQuery.isPending,
        } satisfies AccountState
      }
    />
  );
}
