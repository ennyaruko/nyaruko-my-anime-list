import { useParams, useOutletContext } from "react-router";

import { MediaDetailPage } from "@/pages/media-detail";

import type { AccountState } from "@/entities/account";

export default function MediaDetailRoute() {
  const { id } = useParams();
  const { account } = useOutletContext<AccountState>();

  return <MediaDetailPage mediaId={Number(id)} userId={account?.id} />;
}
