import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

import {
  FeedbackCard,
  useMediaReviews,
  FeedbackCardSkeleton,
} from "@/widgets/media-reviews";

import type { AccountProfile } from "@/entities/account";

import { Column, Heading } from "@/shared/ui";
import { ArrowDownIcon } from "@/shared/icons";

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
      <Heading
        size="m"
        variant="neutral"
        action={
          !reviewsQuery.isPending && reviewsQuery.data?.items.length ? (
            <Link
              to={`/media/${mediaId}/reviews`}
              className={styles.allReviewsLink}
            >
              {t("common:mediaDetail.allReviews")}
              <ArrowDownIcon className={styles.allReviewsLinkArrow} />
            </Link>
          ) : null
        }
      >
        {t("common:mediaDetail.reviews")}
      </Heading>
      {reviewsQuery.isPending ? (
        <ReviewSkeleton />
      ) : reviewsQuery.data.items.length > 0 ? (
        <Column gap="m">
          {reviewsQuery.data.items.map((review, index) => (
            <Fragment key={review.id}>
              {index > 0 && <hr className={styles.divider} />}
              <FeedbackCard review={review} mediaId={mediaId} />
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
