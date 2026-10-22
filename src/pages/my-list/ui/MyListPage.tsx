import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { type AccountProfile } from "@/entities/account";
import { type MyListEntry, myListServiceToken } from "@/entities/my-list";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Table,
  Column,
  Heading,
  Container,
  Breadcrumbs,
  TableSkeleton,
} from "@/shared/ui";

import * as styles from "./MyListPage.css";

type MyListPageProps = {
  accountError: boolean;
  accountPending: boolean;
  account: undefined | AccountProfile;
};

export function MyListPage({
  account,
  accountError,
  accountPending,
}: MyListPageProps) {
  const { t } = useTranslation(["list", "common"]);
  const { accessToken } = useAuth();
  const listService = useAppService(myListServiceToken);
  const userId = account?.id;

  const listQuery = useQuery({
    enabled: Boolean(accessToken && userId),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, userId!, signal),
    queryKey: queryCacheConfig.families.userList.key(userId ?? "", {
      format: "ANIME",
    }),
  });

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
        {accountError && <p role="alert">{t("common:profileError")}</p>}
        {listQuery.isError && <p role="alert">{t("common:listError")}</p>}
        {isListPending ? (
          <TableSkeleton values={[82, 64, 50]} />
        ) : (
          <Table
            numericList
            initialVisibleCount={3}
            items={genres.map((item) => ({
              label: item,
              value: entries.filter((entry) => entry.genres.includes(item))
                .length,
            }))}
          />
        )}
      </Column>
    </Container>
  );
}
