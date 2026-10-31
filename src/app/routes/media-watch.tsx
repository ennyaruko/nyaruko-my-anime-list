import { useParams, useOutletContext } from "react-router";

import { MediaWatchPage } from "@/pages/media-watch";

import type { AccountState } from "@/entities/account";

export default function MediaWatchRoute() {
  const { id } = useParams();
  const { account } = useOutletContext<AccountState>();
  return <MediaWatchPage mediaId={Number(id)} userId={account?.id} />;
}
