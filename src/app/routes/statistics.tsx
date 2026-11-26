import { useOutletContext } from "react-router";

import { StatisticsPage } from "@/pages/statistics";

import type { AccountState } from "@/entities/account";

export default function StatisticsRoute() {
  const accountState = useOutletContext<AccountState>();
  return <StatisticsPage {...accountState} />;
}
