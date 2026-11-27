import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Popover } from "radix-ui";

import type { MediaReview } from "@/entities/media";

import { InfoIcon } from "@/shared/icons";
import { Row, Score, Spinner } from "@/shared/ui";

import { getReviewRatingStatistics } from "../../model/review-rating";
import { useFullMediaReviews } from "../../model/useFullMediaReviews";

import * as styles from "./ReviewRatingPopover.css";
import * as feedbackStyles from "../FeedbackCard/FeedbackCard.css";

export type ReviewRatingPopoverProps = {
  mediaId: number;
  canLoadFull: boolean;
  userId: string | undefined;
  initialReviews: readonly MediaReview[];
};

export function ReviewRatingPopover({
  userId,
  mediaId,
  canLoadFull,
  initialReviews,
}: ReviewRatingPopoverProps) {
  const { t } = useTranslation(["common"]);
  const [open, setOpen] = useState(false);
  const [loadFull, setLoadFull] = useState(false);
  const fullReviewsQuery = useFullMediaReviews({
    userId,
    mediaId,
    enabled: loadFull,
  });
  const reviews = fullReviewsQuery.data ?? initialReviews;
  const statistics = useMemo(
    () => getReviewRatingStatistics(reviews),
    [reviews],
  );
  const fullStatisticsLoaded = Boolean(fullReviewsQuery.data);
  const weightedRating = statistics.weightedRating;
  const agreement = statistics.agreement;
  const positiveRatio = agreement ?? 0;
  const negativeRatio = agreement === null ? 0 : 100 - positiveRatio;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={styles.trigger}
          title={t("common:mediaDetail.reviewRating.open")}
          aria-label={t("common:mediaDetail.reviewRating.open")}
        >
          <InfoIcon className={styles.icon} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={8}
          className={styles.content}
        >
          <div className={styles.primaryRating}>
            {weightedRating === null ? (
              <span className={styles.muted}>—</span>
            ) : (
              <Score
                shadow={false}
                value={weightedRating}
                title={t("common:mediaDetail.reviewRating.weighted")}
              />
            )}
            {weightedRating !== null && (
              <span className={styles.category[getScoreTone(weightedRating)]}>
                {t(getRatingDescriptionKey(weightedRating))}
              </span>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>
                {t("common:mediaDetail.reviewRating.average")}
              </span>
              <strong>{formatRating(statistics.averageRating)}</strong>
            </div>
            <div className={styles.agreement}>
              <div className={styles.agreementHeader}>
                <span className={styles.detailLabel}>
                  {t("common:mediaDetail.reviewRating.agreement")}
                </span>
                <strong>{formatPercent(agreement)}</strong>
              </div>
              <Row wide gap="xs" alignItem="center">
                <div
                  aria-hidden="true"
                  role="presentation"
                  className={styles.reactionBar}
                >
                  <span
                    className={styles.positiveBar}
                    style={{ width: `${positiveRatio}%` }}
                  />
                  <span
                    className={styles.negativeBar}
                    style={{ width: `${negativeRatio}%` }}
                  />
                </div>
                <Row
                  gap="tiny"
                  alignItem="center"
                  aria-label={t(
                    "common:mediaDetail.reviewRating.reactionSummary",
                    {
                      positive: statistics.positiveReactions,
                      negative: statistics.negativeReactions,
                    },
                  )}
                >
                  <span className={feedbackStyles.positiveVotes}>
                    {statistics.positiveReactions}+
                  </span>
                  <span className={feedbackStyles.voteSeparator}>/</span>
                  <span className={feedbackStyles.negativeVotes}>
                    {statistics.negativeReactions}-
                  </span>
                </Row>
              </Row>
            </div>
          </div>

          <div className={styles.footer}>
            <span className={styles.muted}>
              {t("common:mediaDetail.reviewRating.basedOn", {
                count: reviews.length,
              })}
            </span>
            {!fullStatisticsLoaded && canLoadFull && (
              <button
                type="button"
                className={styles.button}
                disabled={fullReviewsQuery.isFetching}
                onClick={() => {
                  if (fullReviewsQuery.isError) {
                    void fullReviewsQuery.refetch();
                    return;
                  }

                  setLoadFull(true);
                }}
              >
                {fullReviewsQuery.isFetching ? (
                  <Spinner size={16} />
                ) : fullReviewsQuery.isError ? (
                  t("common:mediaDetail.reviewRating.retryFull")
                ) : (
                  t("common:mediaDetail.reviewRating.fullStatistics")
                )}
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function formatRating(value: null | number) {
  return value === null ? "—" : value.toFixed(1);
}

function formatPercent(value: null | number) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

function getRatingDescriptionKey(value: number) {
  if (value >= 9) return "common:mediaDetail.reviewRating.excellent";
  if (value >= 8) return "common:mediaDetail.reviewRating.veryPositive";
  if (value >= 7) return "common:mediaDetail.reviewRating.positive";
  if (value >= 6) return "common:mediaDetail.reviewRating.moderatelyPositive";
  if (value >= 5) return "common:mediaDetail.reviewRating.mediocre";
  if (value >= 4) return "common:mediaDetail.reviewRating.somewhatNegative";
  if (value >= 3) return "common:mediaDetail.reviewRating.negative";
  return "common:mediaDetail.reviewRating.extremelyNegative";
}

function getScoreTone(value: number) {
  if (value >= 7) return "positive";
  if (value >= 6) return "warning";
  return "negative";
}
