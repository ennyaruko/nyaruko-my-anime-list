import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { useAccountStatistics } from "@/features/account-statistics";

import type { AccountState } from "@/entities/account";

import {
  Table,
  Column,
  Heading,
  Container,
  Breadcrumbs,
  TableSkeleton,
  ScrollToTopButton,
  QueryErrorBoundary,
} from "@/shared/ui";

import * as styles from "./StatisticsPage.css";

export function StatisticsPage(accountState: AccountState) {
  const { t } = useTranslation(["common"]);

  return (
    <Container as="main" className={styles.page}>
      <ScrollToTopButton />
      <Column gap="m">
        <Breadcrumbs
          items={[
            { to: "/", label: t("common:navigation.myAnime") },
            { label: t("common:list.statistics") },
          ]}
        />
        <Heading variant="neutral">{t("common:list.statistics")}</Heading>
        <QueryErrorBoundary resetKeys={[accountState.account?.id]}>
          <StatisticsContent accountState={accountState} />
        </QueryErrorBoundary>
      </Column>
    </Container>
  );
}

function StatisticsContent({ accountState }: { accountState: AccountState }) {
  const { t, i18n } = useTranslation(["common"]);
  const navigate = useNavigate();
  const query = useAccountStatistics(accountState.account);
  const statistics = query.data;
  const numberFormat = new Intl.NumberFormat(i18n.language);
  const dayFormat = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 1,
  });
  const cards = statistics
    ? [
        {
          label: t("common:statistics.totalAnime"),
          value: numberFormat.format(statistics.count),
        },
        {
          label: t("common:statistics.episodesWatched"),
          value: numberFormat.format(statistics.episodesWatched),
        },
        {
          label: t("common:statistics.daysWatched"),
          value: dayFormat.format(statistics.minutesWatched / 1440),
        },
        {
          label: t("common:statistics.daysPlanned"),
          value: dayFormat.format(statistics.plannedMinutes / 1440),
        },
        {
          label: t("common:statistics.meanScore"),
          value: dayFormat.format(statistics.meanScore),
        },
      ]
    : [];

  return (
    <Column gap="m">
      <section>
        {query.isPending || accountState.accountPending ? (
          <div aria-busy="true" className={styles.summarySkeleton}>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className={styles.summaryCardSkeleton} />
            ))}
          </div>
        ) : statistics ? (
          <div className={styles.summaryGrid}>
            {cards.map(({ label, value }) => (
              <div key={label} className={styles.summaryCard}>
                <strong className={styles.summaryValue}>{value}</strong>
                <span className={styles.summaryLabel}>{label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <Column gap="m">
        <Heading size="m" variant="neutral">
          {t("common:list.genres")}
        </Heading>
        {statistics ? (
          <Table
            numericList
            initialVisibleCount={10}
            items={statistics.genres}
            onItemClick={({ label }) => {
              navigate(`/search?genre=${encodeURIComponent(label)}`);
            }}
          />
        ) : (
          <TableSkeleton values={[82, 64, 50, 42, 35]} />
        )}
      </Column>

      <Column gap="m">
        <Heading size="m" variant="neutral">
          {t("common:list.tags")}
        </Heading>
        {statistics ? (
          <Table
            numericList
            items={statistics.tags}
            initialVisibleCount={10}
            onItemClick={({ label }) => {
              navigate(`/search?tag=${encodeURIComponent(label)}`);
            }}
          />
        ) : (
          <TableSkeleton values={[82, 64, 50, 42, 35]} />
        )}
      </Column>
    </Column>
  );
}
