import { useParams } from "react-router";

import { MediaRecommendationsPage } from "@/pages/media-recommendations";

export default function MediaRecommendationsRoute() {
  const { id } = useParams();

  return <MediaRecommendationsPage mediaId={Number(id)} />;
}
