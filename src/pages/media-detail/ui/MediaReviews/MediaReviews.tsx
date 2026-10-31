import { Fragment } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

import type { AccountProfile } from "@/entities/account";

import { Column, Heading } from "@/shared/ui";

import { useMediaReviews } from "../../model/useMediaReviews";
import { FeedbackCard, FeedbackCardSkeleton } from "../FeedbackCard";

import * as styles from "./MediaReviews.css";
import * as pageStyles from "../MediaDetailPage.css";

type MediaReviewsProps = {
  mediaId: number;
  userId: undefined | AccountProfile["id"];
};

export function MediaReviews({ userId, mediaId }: MediaReviewsProps) {
  const { t } = useTranslation(["common"]);
  const reviewsQuery = useMediaReviews({ userId, mediaId });

  if (reviewsQuery.isError) return null;

  return (
    <section className={pageStyles.section}>
      <Heading size="m" variant="neutral">
        {t("common:mediaDetail.reviews")}
      </Heading>
      {reviewsQuery.isPending ? (
        <ReviewSkeleton />
      ) : reviewsQuery.data.length > 0 ? (
        <Column gap="m">
          {reviewsQuery.data.map((review, index) => (
            <Fragment key={review.id}>
              {index > 0 && <hr className={styles.divider} />}
              <FeedbackCard review={review} />
            </Fragment>
          ))}
        </Column>
      ) : (
        <p className={styles.emptySection}>
          {t("common:mediaDetail.noReviews")}
        </p>
      )}
    </section>
  );
}

function ReviewSkeleton() {
  return (
    <Column gap="m">
      <FeedbackCardSkeleton />
    </Column>
  );
}
