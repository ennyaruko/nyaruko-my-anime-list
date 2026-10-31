import type { MediaReview } from "@/entities/media";

import { MediaReviewsDocument } from "./queries";
import { createAniListGraphQLClient } from "./client";
import type { MediaReviewsQuery } from "./generated/graphql";

/** Loads and maps the five highest-rated reviews returned by AniList. */
export async function getAniListMediaReviews(
  accessToken: string,
  mediaId: number,
  signal?: AbortSignal,
): Promise<MediaReview[]> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    variables: { id: mediaId },
    document: MediaReviewsDocument,
  });

  return (response.Media?.reviews?.nodes ?? []).flatMap((review) =>
    review ? [mapReview(review)] : [],
  );
}

type AniListReviewsConnection = NonNullable<
  NonNullable<MediaReviewsQuery["Media"]>["reviews"]
>;
type AniListReview = NonNullable<
  NonNullable<AniListReviewsConnection["nodes"]>[number]
>;

function mapReview(review: AniListReview): MediaReview {
  return {
    id: review.id,
    body: review.body,
    score: review.score,
    rating: review.rating,
    summary: review.summary,
    createdAt: review.createdAt,
    ratingAmount: review.ratingAmount,
    author: review.user
      ? {
          name: review.user.name,
          avatarUrl: review.user.avatar?.large ?? null,
        }
      : null,
  };
}
