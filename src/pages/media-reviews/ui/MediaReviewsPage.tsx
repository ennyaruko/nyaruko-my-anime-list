import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { useRef, Fragment, useEffect } from "react";

import {
  FeedbackCard,
  ReviewRatingPopover,
  FeedbackCardSkeleton,
  useInfiniteMediaReviews,
} from "@/widgets/media-reviews";

import type { AccountState, AccountProfile } from "@/entities/account";

import {
  Row,
  Column,
  Header,
  Heading,
  BackLink,
  Container,
  QueryErrorBoundary,
  BlockStatusNotFound,
} from "@/shared/ui";

import * as styles from "./MediaReviewsPage.css";

export function MediaReviewsPage({ mediaId }: { mediaId: number }) {
  const { account } = useOutletContext<AccountState>();
  const { t } = useTranslation(["common"]);

  if (!Number.isFinite(mediaId) || mediaId <= 0) {
    return <BlockStatusNotFound className={styles.notFound} />;
  }

  return (
    <Container as="main" className={styles.page}>
      <Column gap="m">
        <Header
          variant="plain"
          leading={<BackLink>{t("common:mediaDetail.back")}</BackLink>}
        />
        <QueryErrorBoundary resetKeys={[mediaId]}>
          <ReviewsResults mediaId={mediaId} userId={account?.id} />
        </QueryErrorBoundary>
      </Column>
    </Container>
  );
}

function ReviewsResults({
  userId,
  mediaId,
}: {
  mediaId: number;
  userId: undefined | AccountProfile["id"];
}) {
  const { t } = useTranslation(["common"]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteMediaReviews({ userId, mediaId });
  const reviews = data?.pages.flatMap(({ items }) => items) ?? [];

  const heading = (
    <Heading variant="neutral">
      <Row gap="xxs" alignItem="center">
        {t("common:mediaDetail.allReviews")}
        {reviews.length > 0 && (
          <ReviewRatingPopover
            userId={userId}
            mediaId={mediaId}
            initialReviews={reviews}
            canLoadFull={hasNextPage}
          />
        )}
      </Row>
    </Heading>
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage();
      },
      { rootMargin: "400px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return (
      <Column gap="m">
        {heading}
        {Array.from({ length: 3 }, (_, index) => (
          <FeedbackCardSkeleton key={index} />
        ))}
      </Column>
    );
  }

  if (reviews.length === 0) {
    return (
      <Column gap="m">
        {heading}
        <p className={styles.empty}>{t("common:mediaDetail.noReviews")}</p>
      </Column>
    );
  }

  return (
    <Column gap="m">
      {heading}
      {reviews.map((review, index) => (
        <Fragment key={review.id}>
          {index > 0 && <hr className={styles.divider} />}
          <FeedbackCard review={review} mediaId={mediaId} />
        </Fragment>
      ))}
      {isFetchingNextPage && <FeedbackCardSkeleton />}
      {hasNextPage && <div ref={sentinelRef} className={styles.sentinel} />}
    </Column>
  );
}
