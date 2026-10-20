import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { MyListEntry, myListServiceToken } from "@/entities/my-list";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import { Table, Column, Heading, Container, Breadcrumbs } from "@/shared/ui";

import * as styles from "./MyListPage.css";

export function MyListPage() {
  const { t } = useTranslation(["list"]);

  const listService = useAppService(myListServiceToken);

  const { accountId, accessToken } = useAuth();

  const userId = accountId;
  const listQuery = useQuery({
    enabled: Boolean(accessToken && userId),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, userId!, signal),
    queryKey: queryCacheConfig.families.userList.key(userId ?? "", {
      format: "ANIME",
    }),
  });

  console.log("accountId", accountId);

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

  return (
    <Container as="main" className={styles.page}>
      <Column gap="m">
        <Breadcrumbs
          items={[{ to: "/", label: "Аниме" }, { label: "Моё аниме" }]}
        />
        <Heading variant="neutral">{t("list:genres")}</Heading>
        <Table
          numericList
          initialVisibleCount={3}
          items={genres.map((item) => ({
            label: item,
            value: entries.filter((entry) => entry.genres.includes(item))
              .length,
          }))}
        />
      </Column>
    </Container>
  );
}
