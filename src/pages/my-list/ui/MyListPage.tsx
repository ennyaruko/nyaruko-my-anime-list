import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { MyListFilters } from "@/features/filters";

import { useAuth } from "@/entities/auth";
import type { AccountState } from "@/entities/account";
import { filterOptionsProviderToken } from "@/entities/filters";
import {
  MediaCard,
  type MyListEntry,
  type MyListStatus,
  MediaCardSkeleton,
  myListServiceToken,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Table,
  Column,
  Heading,
  Spinner,
  GridList,
  Container,
  Breadcrumbs,
  PullToRefresh,
  TableSkeleton,
  BlockStatusEmpty,
} from "@/shared/ui";

import { StatusNavigation } from "./StatusNavigation";

import * as styles from "./MyListPage.css";

const statusSections = [
  { key: "PLANNING", label: "planned", variant: "neutral" },
  { key: "CURRENT", variant: "info", label: "watching" },
  { key: "COMPLETED", label: "completed", variant: "positive" },
  { key: "PAUSED", label: "paused", variant: "warning" },
  { key: "DROPPED", label: "dropped", variant: "negative" },
] as const;

export function MyListPage({ account, accountPending }: AccountState) {
  const userId = account?.id;
  const { t } = useTranslation(["common"]);
  const { accessToken } = useAuth();
  const listService = useAppService(myListServiceToken);
  const filterOptionsProvider = useAppService(filterOptionsProviderToken);

  const [selectedStatus, setSelectedStatus] =
    useState<MyListStatus>("PLANNING");
  const [isManualRefreshPending, setIsManualRefreshPending] = useState(false);

  const listQuery = useQuery({
    enabled: Boolean(accessToken && userId),
    queryKey: queryCacheConfig.families.userList.key(userId ?? ""),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, userId!, signal),
  });

  const filterOptionsQuery = useQuery({
    enabled: Boolean(userId),
    queryKey: queryCacheConfig.families.filters.key(userId ?? ""),
    queryFn: ({ signal }) => filterOptionsProvider.getFilterOptions(signal),
  });

  const refreshList = async () => {
    setIsManualRefreshPending(true);
    try {
      await listQuery.refetch();
    } finally {
      setIsManualRefreshPending(false);
    }
  };

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
  const isListPending =
    isManualRefreshPending ||
    (accountPending && !userId) ||
    (Boolean(userId) && listQuery.isPending && listQuery.data === undefined);

  return (
    <Container as="main" className={styles.page}>
      <Column gap="m">
        <Breadcrumbs
          items={[{ to: "/", label: "Аниме" }, { label: "Моё аниме" }]}
        />
        <PullToRefresh
          pullingContent=""
          onRefresh={refreshList}
          refreshingContent={<Spinner />}
        >
          <Column gap="m">
            <Heading variant="neutral">{t("common:list.genres")}</Heading>
            {isListPending ? (
              <TableSkeleton values={[82, 64, 50]} />
            ) : (
              <Table numericList items={genres} initialVisibleCount={3} />
            )}
            <Heading variant="neutral">{t("common:list.list")}</Heading>
            <StatusNavigation
              onSelect={setSelectedStatus}
              selectedStatus={selectedStatus}
              items={statusSections.map(({ key }) => ({
                status: key,
                count: entries.filter((entry) => entry.status === key).length,
              }))}
            />
            <Heading id={selectedSection.key} variant={selectedSection.variant}>
              {t(`common:ui.watchStatus.${selectedSection.label}`)}
            </Heading>
            <MyListFilters
              userId={userId}
              entries={entries}
              status={selectedStatus}
              options={filterOptionsQuery.data}
              optionsLoading={filterOptionsQuery.isPending}
            >
              {(filteredEntries) =>
                isListPending ? (
                  <GridList
                    renderItem={() => <MediaCardSkeleton size="l" />}
                    data={Array.from({ length: 4 }, (_, index) => index)}
                  />
                ) : filteredEntries.length === 0 ? (
                  <BlockStatusEmpty />
                ) : (
                  <GridList
                    virtualize
                    data={filteredEntries}
                    getKey={(entry) => entry.id}
                    renderItem={(entry) => (
                      <MediaCard
                        size="l"
                        media={entry}
                        editableProgress={selectedStatus === "CURRENT"}
                      />
                    )}
                  />
                )
              }
            </MyListFilters>
          </Column>
        </PullToRefresh>
      </Column>
    </Container>
  );
}
