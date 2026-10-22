import { useTranslation } from "react-i18next";
import { useMemo, useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router";

import { useQuery } from "@tanstack/react-query";

import * as styles from "@/app/styles/anime-page.css";

import { useAuth } from "@/entities/auth";
import { AccountState } from "@/entities/account";
import {
  type MyListEntry,
  type MyListStatus,
  myListServiceToken,
} from "@/entities/my-list";

import { ExitIcon } from "@/shared/icons";
import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Score,
  Table,
  Title,
  Button,
  Heading,
  Combobox,
  Progress,
  Breadcrumbs,
  TableSkeleton,
} from "@/shared/ui";

const statuses: MyListStatus[] = [
  "PLANNING",
  "CURRENT",
  "COMPLETED",
  "DROPPED",
  "PAUSED",
];
const statusKeys: Record<
  MyListStatus,
  | "watchStatus.onHold"
  | "watchStatus.planned"
  | "watchStatus.dropped"
  | "watchStatus.watching"
  | "watchStatus.completed"
> = {
  PAUSED: "watchStatus.onHold",
  DROPPED: "watchStatus.dropped",
  UNKNOWN: "watchStatus.planned",
  PLANNING: "watchStatus.planned",
  CURRENT: "watchStatus.watching",
  REPEATING: "watchStatus.watching",
  COMPLETED: "watchStatus.completed",
};
const titleVariants: Record<
  MyListStatus,
  "paused" | "dropped" | "default" | "planning" | "watching" | "completed"
> = {
  PAUSED: "paused",
  DROPPED: "dropped",
  UNKNOWN: "default",
  CURRENT: "watching",
  PLANNING: "planning",
  REPEATING: "watching",
  COMPLETED: "completed",
};

export default function AnimeListRoute() {
  const { t } = useTranslation(["common"]);
  const { logout, accessToken } = useAuth();
  const { account, accountError, accountPending } =
    useOutletContext<AccountState>();
  const listService = useAppService(myListServiceToken);
  const [activeStatus, setActiveStatus] = useState<MyListStatus>("PLANNING");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("score");
  const [isManualRefreshPending, setIsManualRefreshPending] = useState(false);
  const userId = account?.id;
  const listQuery = useQuery({
    enabled: Boolean(accessToken && userId),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, userId!, signal),
    queryKey: queryCacheConfig.families.userList.key(userId ?? "", {
      format: "ANIME",
    }),
  });

  useEffect(() => {
    setGenre("");
  }, [activeStatus]);

  const entries = useMemo<MyListEntry[]>(
    () => listQuery.data ?? [],
    [listQuery.data],
  );
  const genres = useMemo(
    () =>
      [...new Set(entries.flatMap((entry) => entry.genres))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [entries],
  );
  const counts = useMemo(
    () =>
      entries.reduce<Record<string, number>>((result, entry) => {
        result[entry.status] = (result[entry.status] ?? 0) + 1;
        return result;
      }, {}),
    [entries],
  );
  const filtered = useMemo(
    () =>
      entries
        .filter(
          (entry) =>
            entry.status === activeStatus &&
            (!genre || entry.genres.includes(genre)),
        )
        .sort((a, b) =>
          sort === "title"
            ? a.title.localeCompare(b.title)
            : sort === "year"
              ? (b.year ?? 0) - (a.year ?? 0)
              : sort === "progress"
                ? b.progress - a.progress
                : b.score - a.score,
        ),
    [activeStatus, entries, genre, sort],
  );

  const waitingForFirstList = !userId && accountPending;
  const waitingForListData =
    Boolean(userId) && listQuery.isPending && listQuery.data === undefined;

  const isListPending =
    isManualRefreshPending || waitingForFirstList || waitingForListData;

  const refreshList = async () => {
    setIsManualRefreshPending(true);
    try {
      await listQuery.refetch();
    } catch {
      // The query error state is rendered below.
    } finally {
      setIsManualRefreshPending(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <div>
          <Breadcrumbs
            items={[{ label: "AniList" }, { label: t("common:myAnime") }]}
          />
          <div className={styles.profile}>
            {account?.avatarUrl && (
              <img alt="" src={account.avatarUrl} className={styles.avatar} />
            )}
            <div>
              <h1 className={styles.userName}>
                {account?.username ?? t("common:myAnime")}
              </h1>
              {isListPending ? (
                <div className={styles.textSkeleton} />
              ) : (
                <div className={styles.subtle}>
                  {t("common:animeCount", { count: entries.length })}
                </div>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          leftIcon={<ExitIcon />}
          onClick={() => void logout()}
        >
          {t("common:logout")}
        </Button>
      </div>

      {accountError && (
        <p className={`${styles.state} ${styles.error}`}>
          {t("common:profileError")}
        </p>
      )}
      <section className={styles.section}>
        <h2 className={styles.heading}>{t("common:genres")}</h2>
        {isListPending ? (
          <TableSkeleton values={[82, 64, 50]} />
        ) : (
          <Table
            numericList
            initialVisibleCount={3}
            onItemClick={({ label }) => setGenre(genre === label ? "" : label)}
            items={genres.map((item) => ({
              label: item,
              value: entries.filter((entry) => entry.genres.includes(item))
                .length,
            }))}
          />
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t("common:animeList")}</h2>
        <nav className={styles.tabs} aria-label={t("common:animeStatuses")}>
          {statuses.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveStatus(item)}
              aria-current={activeStatus === item ? "page" : undefined}
              className={`${styles.tab} ${activeStatus === item ? styles.tabActive : ""}`}
            >
              {t(statusKeys[item])}{" "}
              <span className={styles.stat}>({counts[item] ?? 0})</span>
            </button>
          ))}
        </nav>
        <Heading
          variant={
            activeStatus === "PLANNING"
              ? "warning"
              : activeStatus === "CURRENT" || activeStatus === "REPEATING"
                ? "info"
                : activeStatus === "COMPLETED"
                  ? "positive"
                  : activeStatus === "DROPPED"
                    ? "negative"
                    : "neutral"
          }
        >
          {t(statusKeys[activeStatus])}
        </Heading>
        <div className={styles.toolbar}>
          <span className={styles.label}>{t("common:sortBy")}</span>
          <Combobox
            value={sort}
            onValueChange={setSort}
            options={[
              { value: "score", label: t("common:sortScore") },
              { value: "title", label: t("common:sortTitle") },
              { value: "year", label: t("common:sortYear") },
              { value: "progress", label: t("common:sortProgress") },
            ]}
          />
          <Button
            variant="secondary"
            aria-busy={isManualRefreshPending}
            onClick={() => void refreshList()}
            disabled={!userId || isManualRefreshPending}
          >
            {t(
              isManualRefreshPending
                ? "common:listRefreshing"
                : "common:listRefresh",
            )}
          </Button>
          {genre && (
            <Button variant="flat" onClick={() => setGenre("")}>
              {t("common:clearGenre", { genre })}
            </Button>
          )}
        </div>
        {listQuery.isError && (
          <div className={`${styles.state} ${styles.error}`}>
            {t("common:listError")}
          </div>
        )}
        {!isListPending &&
          !accountError &&
          !listQuery.isError &&
          filtered.length === 0 && (
            <div className={styles.state}>
              {t(genre ? "common:noGenreResults" : "common:emptyAnimeList")}
            </div>
          )}
        <div className={styles.cardGrid}>
          {isListPending
            ? Array.from({ length: 5 }, (_, index) => (
                <div key={index}>
                  <div className={styles.posterSkeleton} />
                  <div className={styles.textSkeleton} />
                </div>
              ))
            : filtered.map((entry) => (
                <AnimeCard entry={entry} key={entry.id} />
              ))}
        </div>
      </section>
    </main>
  );
}

function AnimeCard({ entry }: { entry: MyListEntry }) {
  const { t } = useTranslation(["common"]);
  const media =
    entry.format === "TV"
      ? t("common:tvSeries")
      : (entry.format ?? t("common:anime"));
  return (
    <Link
      target="_blank"
      rel="noreferrer"
      className={styles.card}
      to={`https://anilist.co/anime/${entry.animeId}`}
    >
      <div className={styles.posterWrap}>
        {entry.coverUrl ? (
          <img
            loading="lazy"
            alt={entry.title}
            src={entry.coverUrl}
            className={styles.poster}
          />
        ) : (
          <div className={styles.state}>{entry.title}</div>
        )}
        {entry.score > 0 && (
          <Score size="s" value={entry.score} className={styles.score} />
        )}
        {entry.status === "CURRENT" && entry.episodes && (
          <Progress
            size="s"
            editable={false}
            max={entry.episodes}
            value={entry.progress}
            className={styles.progress}
          />
        )}
      </div>
      <Title title={entry.title} variant={titleVariants[entry.status]} />
      <div className={styles.meta}>
        <span>{media}</span>
        <span>{entry.year ?? "—"}</span>
      </div>
    </Link>
  );
}
