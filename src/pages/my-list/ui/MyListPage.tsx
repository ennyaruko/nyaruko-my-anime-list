import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { AccountState } from "@/entities/account";
import {
  MyListCard,
  type MyListEntry,
  type MyListStatus,
  MyListCardSkeleton,
  myListServiceToken,
} from "@/entities/my-list";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Table,
  Column,
  Heading,
  GridList,
  Container,
  Breadcrumbs,
  TableSkeleton,
} from "@/shared/ui";

import { StatusNavigation } from "./StatusNavigation";

import * as styles from "./MyListPage.css";

type MyListPageProps = AccountState;

const statusSections = [
  { key: "PLANNING", label: "planned", variant: "neutral" },
  { key: "CURRENT", variant: "info", label: "watching" },
  { key: "COMPLETED", label: "completed", variant: "positive" },
  { key: "PAUSED", label: "paused", variant: "warning" },
  { key: "DROPPED", label: "dropped", variant: "negative" },
] as const;

export function MyListPage({ account, accountPending }: MyListPageProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<MyListStatus>("PLANNING");
  const { t } = useTranslation(["list", "common", "ui"]);
  const { accessToken } = useAuth();
  const listService = useAppService(myListServiceToken);
  const userId = account?.id;

  const listQuery = useQuery({
    enabled: Boolean(accessToken && userId),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, userId!, signal),
    queryKey: queryCacheConfig.families.userList.key(userId ?? "", {
      format: "ANIME",
      contractVersion: 1,
    }),
  });

  const entries = useMemo<MyListEntry[]>(
    () => listQuery.data?.flatMap(({ list }) => list) ?? [],
    [listQuery.data],
  );

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

  const selectedSection = statusSections.find(
    (section) => section.key === selectedStatus,
  )!;
  const selectedEntries = entries.filter(
    (entry) => entry.status === selectedStatus,
  );

  const isListPending =
    (accountPending && !userId) ||
    (Boolean(userId) && listQuery.isPending && listQuery.data === undefined);

  return (
    <Container as="main" className={styles.page}>
      <Column gap="m">
        <Breadcrumbs
          items={[{ to: "/", label: "Аниме" }, { label: "Моё аниме" }]}
        />
        <Heading variant="neutral">{t("list:genres")}</Heading>
        {isListPending ? (
          <TableSkeleton values={[82, 64, 50]} />
        ) : (
          <Table numericList items={genres} initialVisibleCount={3} />
        )}
        <Heading variant="neutral">{t("list:list")}</Heading>
        <StatusNavigation
          onSelect={setSelectedStatus}
          selectedStatus={selectedStatus}
          items={statusSections.map(({ key }) => ({
            status: key,
            count: entries.filter((entry) => entry.status === key).length,
          }))}
        />
        <Heading id={selectedSection.key} variant={selectedSection.variant}>
          {t(`ui:watchStatus.${selectedSection.label}`)}
        </Heading>
        {isListPending ? (
          <GridList
            renderItem={() => <MyListCardSkeleton size="l" />}
            data={Array.from({ length: 4 }, (_, index) => index)}
          />
        ) : (
          <GridList
            data={selectedEntries}
            getKey={(entry) => entry.id}
            renderItem={(entry) => (
              <MyListCard
                size="l"
                entry={entry}
                showActions={selectedStatus === "CURRENT"}
              />
            )}
          />
        )}
      </Column>
    </Container>
  );
}
