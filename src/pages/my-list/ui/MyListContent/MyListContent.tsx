import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { MyListFilters } from "@/features/filters";

import type { FilterOptions } from "@/entities/filters";
import type { Media, MyListEntry, MediaContentMode } from "@/entities/media";

import { Row, Heading } from "@/shared/ui";
import { DeleteIcon, ArrowDownIcon } from "@/shared/icons";

import { MyListResults } from "../MyListResults";
import { StatusNavigation } from "../StatusNavigation";
import { useMyListStatus } from "../../model/useMyListStatus";

import * as styles from "./MyListContent.css";

const statusSections = [
  { key: "PLANNING", label: "planned", variant: "warning" },
  { key: "CURRENT", variant: "info", label: "watching" },
  { key: "COMPLETED", label: "completed", variant: "positive" },
  { key: "REPEATING", label: "repeating", variant: "feature" },
  { key: "PAUSED", label: "paused", variant: "neutral" },
  { key: "DROPPED", label: "dropped", variant: "negative" },
] as const;

type MyListContentProps = {
  entries: MyListEntry[];
  isListPending: boolean;
  optionsLoading: boolean;
  userId: string | undefined;
  contentMode: MediaContentMode;
  options: undefined | FilterOptions;
  onAddToWatch: (media: Media) => void;
};

export function MyListContent({
  userId,
  entries,
  options,
  contentMode,
  onAddToWatch,
  isListPending,
  optionsLoading,
}: MyListContentProps) {
  const { t } = useTranslation(["common"]);
  const { selectStatus, selectedStatus } = useMyListStatus();
  const selectedSection = statusSections.find(
    (section) => section.key === selectedStatus,
  )!;
  return (
    <>
      <Heading
        variant="neutral"
        action={
          <Link
            to="/list-recommendations"
            className={styles.recommendationsLink}
          >
            {t("common:list.recommendations")}
            <ArrowDownIcon className={styles.recommendationsArrow} />
          </Link>
        }
      >
        {t("common:list.list")}
      </Heading>
      <StatusNavigation
        loading={isListPending}
        onSelect={selectStatus}
        selectedStatus={selectedStatus}
        items={statusSections.map(({ key }) => ({
          status: key,
          count: entries.filter((entry) => entry.status === key).length,
        }))}
      />
      <MyListFilters
        userId={userId}
        entries={entries}
        options={options}
        status={selectedStatus}
        contentMode={contentMode}
        optionsLoading={optionsLoading}
      >
        {(filteredEntries, resetFilters, hasUnsavedChanges, filtersPanel) => (
          <>
            <Heading
              id={selectedSection.key}
              variant={selectedSection.variant}
              action={
                hasUnsavedChanges ? (
                  <Row gap="xxs" alignItem="center">
                    <span className={styles.foundResult}>
                      {isListPending
                        ? "—"
                        : t("common:list.filteredResults", {
                            count: filteredEntries.length,
                          })}
                    </span>
                    <button
                      onClick={resetFilters}
                      className={styles.resetFilters}
                    >
                      <DeleteIcon />
                    </button>
                  </Row>
                ) : undefined
              }
            >
              {t(`common:ui.watchStatus.${selectedSection.label}`)}
            </Heading>
            {filtersPanel}
            <MyListResults
              userId={userId}
              entries={filteredEntries}
              isPending={isListPending}
              onAddToWatch={onAddToWatch}
            />
          </>
        )}
      </MyListFilters>
    </>
  );
}
