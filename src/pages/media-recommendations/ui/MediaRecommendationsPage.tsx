import { useOutletContext } from "react-router";

import type { AccountState } from "@/entities/account";

import { RecommendationsPage } from "./RecommendationsPage";

export function MediaRecommendationsPage({ mediaId }: { mediaId: number }) {
  const { account } = useOutletContext<AccountState>();

  return <RecommendationsPage mediaId={mediaId} userId={account?.id} />;
}
