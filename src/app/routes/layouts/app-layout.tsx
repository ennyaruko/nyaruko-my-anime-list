import { Outlet, useOutletContext } from "react-router";

import { BottomNavigation } from "@/widgets/bottom-navigation";

import type { AccountState } from "@/entities/account";

import * as styles from "./app-layout.css";

export default function AppLayout() {
  const accountState = useOutletContext<AccountState>();

  return (
    <div className={styles.root}>
      <Outlet context={accountState} />
      <BottomNavigation account={accountState.account} />
    </div>
  );
}
