import { useOutletContext } from "react-router";

import { ListRecommendationsPage } from "@/pages/list-recommendations";

import type { AccountState } from "@/entities/account";

export default function ListRecommendationsRoute() {
  const accountState = useOutletContext<AccountState>();
  return <ListRecommendationsPage {...accountState} />;
}
