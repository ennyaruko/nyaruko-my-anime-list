import { Outlet, useLocation, useOutletContext } from "react-router";

import { BottomNavigation } from "@/widgets/bottom-navigation";

import type { AccountState } from "@/entities/account";

import { QueryErrorBoundary } from "@/shared/ui";

import * as styles from "./app-layout.css";

export default function AppLayout() {
  const accountState = useOutletContext<AccountState>();
  const location = useLocation();

  return (
    <div className={styles.root}>
      <QueryErrorBoundary size="l" resetKeys={[location.key]}>
        <Outlet context={accountState} />
      </QueryErrorBoundary>
      <BottomNavigation account={accountState.account} />
    </div>
  );
}
