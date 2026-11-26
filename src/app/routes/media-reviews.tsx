import { useParams } from "react-router";

import { MediaReviewsPage } from "@/pages/media-reviews";

export default function MediaReviewsRoute() {
  const { id } = useParams();

  return <MediaReviewsPage mediaId={Number(id)} />;
}
