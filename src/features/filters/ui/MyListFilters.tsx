import { useTranslation } from "react-i18next";
import { useState, type ReactNode } from "react";

import type { MyListEntry, MyListStatus } from "@/entities/my-list";
import type { MediaSortKey, FilterOptions } from "@/entities/filters";

import { FilterIcon } from "@/shared/icons";
import {
  Row,
  Button,
  Column,
  Drawer,
  Heading,
  DrawerClose,
  MultiSelect,
  LabeledCombobox,
} from "@/shared/ui";

import { useMyListFilters } from "../model/my-list/useMyListFilters";

import * as styles from "./MyListFilters.css";

type MyListFiltersProps = {
  status: MyListStatus;
  options?: FilterOptions;
  optionsLoading?: boolean;
  entries: readonly MyListEntry[];
  children: (filteredEntries: MyListEntry[]) => ReactNode;
};

const sortKeys: MediaSortKey[] = [
  "releaseDate",
  "popularity",
  "averageScore",
  "score",
  "title",
  "startDate",
  "completedDate",
  "lastUpdated",
  "lastAdded",
  "progress",
];

/** My List's concrete filter controls and filtered result. */
export function MyListFilters({
  status,
  entries,
  options,
  children,
  optionsLoading = false,
}: MyListFiltersProps) {
  const { t } = useTranslation(["ui", "common", "list"]);
  const [isOpen, setIsOpen] = useState(false);
  const { sort, tags, genres, setSort, setTags, setGenres, filteredEntries } =
    useMyListFilters(entries, status);

  return (
    <>
      <Row gap="m" justifyContent="end">
        <LabeledCombobox
          value={sort}
          label={t("common:sortLabel")}
          onValueChange={(value) => setSort(value as MediaSortKey)}
          options={sortKeys.map((value) => ({
            value,
            label: t(`common:sort.${value}`),
          }))}
        />
        <Button rightIcon={<FilterIcon />} onClick={() => setIsOpen(true)}>
          {t("ui:filters.open")}
        </Button>
      </Row>
      <Drawer
        open={isOpen}
        className={styles.drawer}
        onClose={() => setIsOpen(false)}
      >
        <div className={styles.drawerHeader}>
          <Heading variant="neutral">{t("ui:filters.title")}</Heading>
          <DrawerClose>{t("ui:filters.close")}</DrawerClose>
        </div>
        <Column gap="s">
          <Heading variant="neutral">{t("list:genres")}</Heading>
          <MultiSelect
            cleanable
            searchable
            value={genres}
            id="my-list-genres"
            loading={optionsLoading}
            onValueChange={setGenres}
            options={options?.genres ?? []}
          />
        </Column>
        <Column gap="s">
          <Heading variant="neutral">{t("list:tags")}</Heading>
          <MultiSelect
            cleanable
            searchable
            virtualize
            value={tags}
            id="my-list-tags"
            onValueChange={setTags}
            loading={optionsLoading}
            options={options?.tags ?? []}
          />
        </Column>
      </Drawer>
      {children(filteredEntries)}
    </>
  );
}
