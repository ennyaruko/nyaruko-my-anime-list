import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";

import { useQuery } from "@tanstack/react-query";

import { MediaSearchResults } from "@/widgets/media-search-results";

import { MediaSearchFilters } from "@/features/filters";
import { useAdultContent } from "@/features/toggle-adult-content";

import type { AccountState } from "@/entities/account";
import { filterOptionsProviderToken } from "@/entities/filters";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Column,
  Container,
  Breadcrumbs,
  ScrollToTopButton,
  QueryErrorBoundary,
  ComponentErrorBoundary,
} from "@/shared/ui";

import { useSearchPageParams } from "../model/useSearchPageParams";

import { SearchInput } from "./SearchInput";

import * as styles from "./SearchPage.css";

const RESULTS_PER_PAGE = 50;

export function SearchPage() {
  const { t } = useTranslation(["common"]);
  const { mode: contentMode } = useAdultContent();
  const { account } = useOutletContext<AccountState>();
  const {
    searchTerm,
    initialFilters,
    updateSearchTerm,
    debouncedSearchTerm,
    clearInitialFilters,
  } = useSearchPageParams();
  const filterOptionsProvider = useAppService(filterOptionsProviderToken);

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
          <SearchInput value={searchTerm} onChange={updateSearchTerm} />
        </ComponentErrorBoundary>
        <QueryErrorBoundary>
          <MediaSearchFilters
            userId={account?.id}
            contentMode={contentMode}
            perPage={RESULTS_PER_PAGE}
            search={debouncedSearchTerm}
            initialFilters={initialFilters}
            options={filterOptionsQuery.data}
            onResetInitialFilters={clearInitialFilters}
            optionsLoading={filterOptionsQuery.isPending}
          >
            {(parameters) => (
              <MediaSearchResults account={account} parameters={parameters} />
            )}
          </MediaSearchFilters>
        </QueryErrorBoundary>
      </Column>
    </Container>
  );
}
