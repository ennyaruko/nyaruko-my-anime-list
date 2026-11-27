import type { MediaReview } from "@/entities/media";

export type ReviewRatingStatistics = {
  ratedReviews: number;
  agreement: null | number;
  positiveReactions: number;
  negativeReactions: number;
  averageRating: null | number;
  weightedRating: null | number;
};

export function getReviewRatingStatistics(
  reviews: readonly MediaReview[],
): ReviewRatingStatistics {
  let weightedScoreTotal = 0;
  let weightTotal = 0;
  let scoreTotal = 0;
  let ratedReviews = 0;
  let positiveReactions = 0;
  let negativeReactions = 0;

  for (const review of reviews) {
    const { likes, dislikes } = getReactions(review);
    positiveReactions += likes;
    negativeReactions += dislikes;

    if (review.score === null) continue;

    const rating = review.score / 10;
    const weight = 1 + (0.5 * (likes - dislikes)) / (likes + dislikes + 10);
    weightedScoreTotal += rating * weight;
    weightTotal += weight;
    scoreTotal += rating;
    ratedReviews += 1;
  }

  const totalReactions = positiveReactions + negativeReactions;

  return {
    ratedReviews,
    positiveReactions,
    negativeReactions,
    averageRating: ratedReviews > 0 ? scoreTotal / ratedReviews : null,
    weightedRating: weightTotal > 0 ? weightedScoreTotal / weightTotal : null,
    agreement:
      totalReactions > 0 ? (positiveReactions / totalReactions) * 100 : null,
  };
}

function getReactions(review: MediaReview) {
  const total = Math.max(0, review.ratingAmount ?? 0);
  const net = review.rating ?? 0;
  const likes = Math.max(0, Math.min(total, Math.round((total + net) / 2)));

  return { likes, dislikes: total - likes };
}
