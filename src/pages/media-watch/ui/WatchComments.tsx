import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { AccountIdentity } from "@/entities/account";
import {
  type CommentSort,
  type PlaybackComment,
  type PlaybackCommentsPage,
  mediaPlaybackServiceToken,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Button,
  Heading,
  LabeledCombobox,
  MarkdownContent,
  CollapsibleContent,
} from "@/shared/ui";

import * as styles from "./MediaWatch.css";

export function WatchComments({ catalogId }: { catalogId: string }) {
  const { t } = useTranslation(["common"]);
  const [sort, setSort] = useState<CommentSort>("new");
  const service = useAppService(mediaPlaybackServiceToken);
  const query = useInfiniteQuery({
    retry: false,
    initialPageParam: 0,
    meta: { errorNotifier: () => null },
    queryKey: queryCacheConfig.families.playbackComments.key(catalogId, sort),
    getNextPageParam: (lastPage: PlaybackCommentsPage) =>
      lastPage.nextOffset ?? undefined,
    queryFn: ({ signal, pageParam }) =>
      service.getComments(catalogId, sort, pageParam, signal),
  });
  const comments = [
    ...new Map(
      query.data?.pages
        .flatMap((page) => page.items)
        .map((item) => [item.id, item]) ?? [],
    ).values(),
  ];
  return (
    <section className={styles.section}>
      <Heading variant="neutral">{t("common:watch.comments")}</Heading>
      <LabeledCombobox
        value={sort}
        id="comment-sort"
        searchable={false}
        label={t("common:sortLabel")}
        className={styles.commentSort}
        onValueChange={(value) => setSort(value as CommentSort)}
        options={[
          { value: "new", label: t("common:watch.newest") },
          { value: "old", label: t("common:watch.oldest") },
          { value: "nice", label: t("common:watch.best") },
        ]}
      />
      {query.isPending && <p role="status">{t("common:loading")}</p>}
      {query.isError && (
        <div role="alert">
          {t("common:watch.commentsFailed")}{" "}
          <Button variant="flat" onClick={() => void query.refetch()}>
            {t("common:watch.retry")}
          </Button>
        </div>
      )}
      {!query.isPending && !query.isError && !comments.length && (
        <p>{t("common:watch.noComments")}</p>
      )}
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      {query.hasNextPage && (
        <Button
          variant="secondary"
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
        >
          {t("common:watch.more")}
        </Button>
      )}
    </section>
  );
}

function Comment({
  comment,
  child = false,
}: {
  child?: boolean;
  comment: PlaybackComment;
}) {
  const { t, i18n } = useTranslation(["common"]);
  const [expanded, setExpanded] = useState(false);
  const service = useAppService(mediaPlaybackServiceToken);
  const replies = useQuery({
    retry: false,
    enabled: expanded && !child,
    meta: { errorNotifier: () => null },
    queryFn: ({ signal }) => service.getReplies(comment.id, signal),
    queryKey: queryCacheConfig.families.playbackReplies.key(comment.id),
  });
  return (
    <article className={styles.comment}>
      <AccountIdentity
        name={comment.author}
        avatarUrl={comment.avatar}
        trailing={
          <time
            className={styles.meta}
            dateTime={new Date(comment.createdAt).toISOString()}
          >
            {new Date(comment.createdAt).toLocaleDateString(i18n.language)}
          </time>
        }
      />
      <div className={styles.commentBody}>
        <CollapsibleContent
          expandLabel={t("common:mediaDetail.expandReview")}
          collapseLabel={t("common:mediaDetail.collapseReview")}
        >
          <MarkdownContent variant="review">{comment.body}</MarkdownContent>
        </CollapsibleContent>
      </div>
      <div className={styles.meta}>
        <span
          aria-label={t("common:watch.likes")}
          className={
            comment.likes > 0
              ? styles.votePositive
              : comment.likes < 0
                ? styles.voteNegative
                : undefined
          }
        >
          +{comment.likes}
        </span>
        <span
          aria-label={t("common:watch.dislikes")}
          className={comment.dislikes > 0 ? styles.voteNegative : undefined}
        >
          −{comment.dislikes}
        </span>
      </div>
      {!child && comment.replies > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          className={styles.replyLink}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? t("common:watch.hideReplies")
            : t("common:watch.replies", { count: comment.replies })}
        </button>
      )}
      {expanded && (
        <div className={styles.replies}>
          {replies.isPending && <p role="status">{t("common:loading")}</p>}
          {replies.isError && (
            <Button variant="flat" onClick={() => void replies.refetch()}>
              {t("common:watch.retry")}
            </Button>
          )}
          {replies.data?.map((reply) => (
            <Comment child key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </article>
  );
}
