import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { AccountState } from "@/entities/account";
import { MyListCard, myListServiceToken } from "@/entities/my-list";

import { SearchIcon } from "@/shared/icons";
import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Input,
  Column,
  Heading,
  Spinner,
  GridList,
  Container,
  Breadcrumbs,
  BlockStatusEmpty,
} from "@/shared/ui";

import * as styles from "./SearchPage.css";

export function SearchPage() {
  const { t } = useTranslation(["common"]);
  const { accessToken } = useAuth();
  const { account, accountPending } = useOutletContext<AccountState>();
  const listService = useAppService(myListServiceToken);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = account?.id;

  const listQuery = useQuery({
    enabled: Boolean(accessToken && userId),
    queryKey: queryCacheConfig.families.userList.key(userId ?? ""),
    queryFn: ({ signal }) =>
      listService.getMyList(accessToken!, userId!, signal),
  });

  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
  const entries = useMemo(
    () =>
      (listQuery.data?.flatMap(({ list }) => list) ?? []).filter((entry) =>
        entry.title.toLocaleLowerCase().includes(normalizedSearchTerm),
      ),
    [listQuery.data, normalizedSearchTerm],
  );
  const isLoading = accountPending || (Boolean(userId) && listQuery.isPending);
  const hasSearchTerm = normalizedSearchTerm.length > 0;

  return (
    <Container as="main" className={styles.page}>
      <Column gap="m">
        <Breadcrumbs
          items={[
            { to: "/", label: t("common:navigation.myAnime") },
            { label: t("common:navigation.search") },
          ]}
        />
        <Heading variant="neutral">{t("common:navigation.search")}</Heading>
        <Input
          autoComplete="off"
          value={searchTerm}
          placeholder={t("common:search.placeholder")}
          leftSlot={<SearchIcon className={styles.searchIcon} />}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
        {isLoading ? (
          <Spinner />
        ) : (
          hasSearchTerm &&
          (entries.length > 0 ? (
            <GridList
              data={entries}
              getKey={(entry) => entry.id}
              renderItem={(entry) => <MyListCard size="l" entry={entry} />}
            />
          ) : (
            <BlockStatusEmpty />
          ))
        )}
      </Column>
    </Container>
  );
}
