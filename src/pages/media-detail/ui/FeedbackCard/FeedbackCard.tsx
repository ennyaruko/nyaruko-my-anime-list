import { useTranslation } from "react-i18next";

import clsx from "clsx";

import {
  TranslatedContent,
  useContentLanguage,
  ContentLanguageControls,
} from "@/features/translate-content";

import type { MediaReview } from "@/entities/media";
import { AccountIdentity, AccountIdentitySkeleton } from "@/entities/account";

import { Row, RatingCompact } from "@/shared/ui";
import { skeletonAnimation } from "@/shared/styles";
import { MarkdownContent, CollapsibleContent } from "@/shared/ui";
import type { TextTranslations } from "@/shared/lib/content-markup";

import * as styles from "./FeedbackCard.css";

export type FeedbackCardProps = {
  review: MediaReview;
};

export type FeedbackCardSkeletonProps = {
  open?: boolean;
};

/** Displays one AniList review with safe Markdown rendering and collapse state. */
export function FeedbackCard({ review }: FeedbackCardProps) {
  const { t, i18n } = useTranslation(["common"]);
  const { language, setLanguage } = useContentLanguage(review.id, "reviews");
  const voteCounts = getReviewVoteCounts(review.rating, review.ratingAmount);
  const score = review.score === null ? null : review.score / 10;
  const createdAt = new Date(review.createdAt * 1_000);
  const formattedDate = formatRelativeDate(createdAt, i18n.language);
  const body = review.body ?? "";
  const hasBody = body.trim().length > 0;

  const renderContent = (translations: TextTranslations) => (
    <>
      {review.summary && (
        <p className={styles.summary}>
          {Object.hasOwn(translations, review.summary)
            ? translations[review.summary]
            : review.summary}
        </p>
      )}
      {hasBody && (
        <CollapsibleContent
          collapsedHeight={100}
          expandLabel={t("common:mediaDetail.expandReview")}
          collapseLabel={t("common:mediaDetail.collapseReview")}
        >
          <div className={styles.body}>
            <MarkdownContent variant="review" translations={translations}>
              {body}
            </MarkdownContent>
          </div>
        </CollapsibleContent>
      )}
    </>
  );

  return (
    <article className={styles.root}>
      <AccountIdentity
        name={review.author?.name}
        avatarUrl={review.author?.avatarUrl}
        trailing={
          <time className={styles.date} dateTime={createdAt.toISOString()}>
            {formattedDate}
          </time>
        }
        content={
          <Row wide gap="xs" alignItem="center" justifyContent="space-between">
            <Row gap="xs" alignItem="center">
              {score !== null && <RatingCompact value={score} />}
              <Row gap="tiny" alignItem="center">
                <span className={styles.positiveVotes}>
                  {voteCounts.positive}+
                </span>
                <span className={styles.voteSeparator}>/</span>
                <span className={styles.negativeVotes}>
                  {voteCounts.negative}-
                </span>
              </Row>
            </Row>
            {(hasBody || Boolean(review.summary)) && (
              <ContentLanguageControls
                language={language}
                onChange={setLanguage}
              />
            )}
          </Row>
        }
      />
      {language === "ru" ? (
        <TranslatedContent
          content={body}
          key={review.id}
          variant="review"
          extraTexts={review.summary ? [review.summary] : []}
        >
          {renderContent}
        </TranslatedContent>
      ) : (
        renderContent({})
      )}
    </article>
  );
}

export function FeedbackCardSkeleton({
  open = false,
}: FeedbackCardSkeletonProps) {
  return (
    <article className={styles.root}>
      <AccountIdentitySkeleton />
      <span className={clsx(styles.summarySkeleton, skeletonAnimation)} />
      <div
        className={clsx(
          styles.bodySkeleton,
          open && styles.bodySkeletonOpen,
          skeletonAnimation,
        )}
      />
      <span className={clsx(styles.toggleSkeleton, skeletonAnimation)} />
    </article>
  );
}

function getReviewVoteCounts(
  rating: null | number,
  ratingAmount: null | number,
) {
  if (ratingAmount === null || rating === null) {
    return {
      positive: Math.max(rating ?? 0, 0),
      negative: Math.max(-(rating ?? 0), 0),
    };
  }

  const positive = Math.max(
    0,
    Math.min(ratingAmount, Math.round((ratingAmount + rating) / 2)),
  );

  return { positive, negative: ratingAmount - positive };
}

function formatRelativeDate(date: Date, locale: string): string {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const elapsedSeconds = (date.getTime() - Date.now()) / 1_000;
  const intervals = [
    { limit: 60, divisor: 1, unit: "second" as const },
    { divisor: 60, limit: 60 * 60, unit: "minute" as const },
    { divisor: 60 * 60, limit: 24 * 60 * 60, unit: "hour" as const },
    {
      unit: "day" as const,
      divisor: 24 * 60 * 60,
      limit: 7 * 24 * 60 * 60,
    },
    {
      unit: "week" as const,
      limit: 30 * 24 * 60 * 60,
      divisor: 7 * 24 * 60 * 60,
    },
    {
      unit: "month" as const,
      limit: 365 * 24 * 60 * 60,
      divisor: 30 * 24 * 60 * 60,
    },
    {
      unit: "year" as const,
      divisor: 365 * 24 * 60 * 60,
      limit: Number.POSITIVE_INFINITY,
    },
  ];
  const interval = intervals.find(
    ({ limit }) => Math.abs(elapsedSeconds) < limit,
  );
  if (!interval) return formatter.format(0, "second");

  return formatter.format(
    Math.round(elapsedSeconds / interval.divisor),
    interval.unit,
  );
}
