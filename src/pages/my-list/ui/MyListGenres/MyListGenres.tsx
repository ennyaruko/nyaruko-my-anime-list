import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { MyListEntry } from "@/entities/media";

import { Table, Heading, TableSkeleton } from "@/shared/ui";

type MyListGenresProps = { isPending: boolean; entries: MyListEntry[] };
export function MyListGenres({ entries, isPending }: MyListGenresProps) {
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
      <Heading variant="neutral">{t("common:list.genres")}</Heading>
      {isPending ? (
        <TableSkeleton values={[82, 64, 50]} />
      ) : (
        <Table numericList items={genres} initialVisibleCount={3} />
      )}
    </>
  );
}
