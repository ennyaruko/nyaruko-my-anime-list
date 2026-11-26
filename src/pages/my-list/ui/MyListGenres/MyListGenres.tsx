import { useMemo } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import type { MyListEntry } from "@/entities/media";

import { ArrowDownIcon } from "@/shared/icons";
import { Table, Heading, TableSkeleton } from "@/shared/ui";

import * as styles from "./MyListGenres.css";

type MyListGenresProps = {
  isPending: boolean;
  entries: MyListEntry[];
  onGenreClick: (genre: string) => void;
};
export function MyListGenres({
  entries,
  isPending,
  onGenreClick,
}: MyListGenresProps) {
  const { t } = useTranslation(["common"]);
  const genres = useMemo(
    () =>
      [...new Set(entries.flatMap((entry) => entry.genres))]
        .map((genre) => ({
          label: genre,
          value: entries.filter((entry) => entry.genres.includes(genre)).length,
        }))
        .sort(
          (first, second) =>
            second.value - first.value ||
            first.label.localeCompare(second.label),
        ),
    [entries],
  );

  return (
    <>
      <Heading
        variant="neutral"
        action={
          <Link to="/statistics" className={styles.statisticsLink}>
            {t("common:list.statistics")}
            <ArrowDownIcon className={styles.statisticsLinkArrow} />
          </Link>
        }
      >
        {t("common:list.genres")}
      </Heading>
      {isPending ? (
        <TableSkeleton values={[82, 64, 50]} />
      ) : (
        <Table
          numericList
          items={genres}
          initialVisibleCount={3}
          onItemClick={({ label }) => onGenreClick(label)}
        />
      )}
    </>
  );
}
