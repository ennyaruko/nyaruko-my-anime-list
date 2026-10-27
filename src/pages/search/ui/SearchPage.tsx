import { useTranslation } from "react-i18next";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useOutletContext } from "react-router";

import { useQuery } from "@tanstack/react-query";

import { MediaSearchFilters } from "@/features/filters";

import type { AccountState } from "@/entities/account";
import {
  type MediaFiltersState,
  filterOptionsProviderToken,
} from "@/entities/filters";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Column,
  Container,
  Breadcrumbs,
  ScrollToTopButton,
  QueryErrorBoundary,
  ComponentErrorBoundary,
} from "@/shared/ui";

import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";

import * as styles from "./SearchPage.css";

const RESULTS_PER_PAGE = 50;

export function SearchPage() {
  const { t } = useTranslation(["common"]);
  const { account } = useOutletContext<AccountState>();
  const [searchParams] = useSearchParams();
  const filterGenresKey = JSON.stringify(searchParams.getAll("genre"));
  const filterTagsKey = JSON.stringify(searchParams.getAll("tag"));
  const initialFilters = useMemo<Partial<MediaFiltersState>>(() => {
    const genres = JSON.parse(filterGenresKey) as string[];
    const tags = JSON.parse(filterTagsKey) as string[];

    return {
      ...(genres.length > 0 ? { genres } : {}),
      ...(tags.length > 0 ? { tags } : {}),
    };
  }, [filterGenresKey, filterTagsKey]);
  const filterOptionsProvider = useAppService(filterOptionsProviderToken);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearchTerm(searchTerm.trim()),
      250,
    );
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const filterOptionsQuery = useQuery({
    enabled: Boolean(account?.id),
    queryFn: ({ signal }) => filterOptionsProvider.getFilterOptions(signal),
    queryKey: queryCacheConfig.families.filters.key(String(account?.id ?? "")),
  });

  return (
    <Container as="main" className={styles.page}>
      <ScrollToTopButton />
      <Column gap="m">
        <Breadcrumbs
          items={[
            { to: "/", label: t("common:navigation.myAnime") },
            { label: t("common:navigation.search") },
          ]}
        />
        <ComponentErrorBoundary>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </ComponentErrorBoundary>
        <QueryErrorBoundary>
          <MediaSearchFilters
            userId={account?.id}
            perPage={RESULTS_PER_PAGE}
            search={debouncedSearchTerm}
            initialFilters={initialFilters}
            options={filterOptionsQuery.data}
            optionsLoading={filterOptionsQuery.isPending}
          >
            {(parameters) => (
              <SearchResults account={account} parameters={parameters} />
            )}
          </MediaSearchFilters>
        </QueryErrorBoundary>
      </Column>
    </Container>
  );
}
