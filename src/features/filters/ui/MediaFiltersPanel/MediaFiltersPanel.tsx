import type { ReactNode } from "react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import type {
  MediaSortKey,
  FilterOptions,
  MediaFiltersState,
  MediaFormatFilter,
  MediaSourceFilter,
  MediaStatusFilter,
  FilterSelectionMode,
} from "@/entities/filters";

import { FilterIcon, ArrowDownIcon, FilterCheckedIcon } from "@/shared/icons";
import {
  Row,
  Button,
  Column,
  Drawer,
  Heading,
  Container,
  ScrollArea,
  MultiSelect,
  LabeledCheckbox,
  LabeledCombobox,
  showNotification,
} from "@/shared/ui";

import {
  formatFilterOptions,
  sourceFilterOptions,
  statusFilterOptions,
} from "../../model/media-filter-options";

import * as styles from "./MediaFiltersPanel.css";

export type MediaFiltersPanelProps = {
  onSave: VoidFunction;
  onReset: VoidFunction;
  options?: FilterOptions;
  optionsLoading?: boolean;
  filters: MediaFiltersState;
  hasUnsavedChanges: boolean;
  savedFilters: MediaFiltersState;
  sortOptions: readonly MediaSortKey[];
  onChange: (updates: Partial<MediaFiltersState>) => void;
};

function countSelectedValues(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (typeof value === "boolean") return Number(value);
  if (typeof value !== "object" || value === null) return 0;

  return Object.values(value).reduce(
    (count, nestedValue) => count + countSelectedValues(nestedValue),
    0,
  );
}

type SelectedValuesProps = {
  values: string[];
  onRemove: (value: string) => void;
  options: { value: string; label: string }[];
};

function SelectedValues({ values, options, onRemove }: SelectedValuesProps) {
  if (values.length === 0) return null;
  const labelsByValue = new Map(
    options.map((option) => [option.value, option.label]),
  );

  return (
    <div className={styles.selectedValues}>
      {values.map((value, index) => {
        const label = labelsByValue.get(value) ?? value;

        return (
          <Fragment key={value}>
            <button
              type="button"
              title={label}
              onClick={() => onRemove(value)}
              className={styles.selectedValue}
            >
              {label}
            </button>
            {index < values.length - 1 && <span>,</span>}
          </Fragment>
        );
      })}
    </div>
  );
}

type FilterSectionProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

function FilterSection({ title, actions, children }: FilterSectionProps) {
  return (
    <Column wide gap="s">
      <Heading action={actions} variant="neutral">
        {title}
      </Heading>
      <Column gap="tiny">{children}</Column>
    </Column>
  );
}

function toggleValue<T extends string>(
  values: T[],
  value: T,
  checked: boolean | "indeterminate",
) {
  return checked === true
    ? [...values, value]
    : values.filter((current) => current !== value);
}

export function MediaFiltersPanel({
  onSave,
  filters,
  options,
  onReset,
  onChange,
  sortOptions,
  savedFilters,
  hasUnsavedChanges,
  optionsLoading = false,
}: MediaFiltersPanelProps) {
  const { t } = useTranslation(["common"]);
  const [open, setOpen] = useState(false);
  const count = countSelectedValues(filters);
  const filterIcon = hasUnsavedChanges ? (
    <FilterCheckedIcon className={styles.checkedFilterIcon} />
  ) : (
    <FilterIcon />
  );
  const genreOptions = options?.genres ?? [];
  const tagOptions = options?.tags ?? [];

  const handleStatusChange = (
    value: MediaStatusFilter,
    checked: boolean | "indeterminate",
  ) => onChange({ statuses: toggleValue(filters.statuses, value, checked) });
  const handleFormatChange = (
    value: MediaFormatFilter,
    checked: boolean | "indeterminate",
  ) => onChange({ formats: toggleValue(filters.formats, value, checked) });
  const handleSourceChange = (
    value: MediaSourceFilter,
    checked: boolean | "indeterminate",
  ) => onChange({ sources: toggleValue(filters.sources, value, checked) });
  const handleOpenDrawer = () => setOpen(true);
  const handleCloseDrawer = () => setOpen(false);
  const handleSaveAndClose = () => {
    onSave();
    handleCloseDrawer();
    showNotification(t("notify.saveFilters"), "success");
  };
  const handleSortChange = (value: string) =>
    onChange({ sort: value as MediaSortKey });
  const handleSourceModeChange = (mode: FilterSelectionMode) =>
    onChange({ sourceMode: mode });
  const handleGenreRemove = (value: string) =>
    onChange({ genres: filters.genres.filter((genre) => genre !== value) });
  const handleTagRemove = (value: string) =>
    onChange({ tags: filters.tags.filter((tag) => tag !== value) });
  const handleGenresChange = (genres: string[]) => onChange({ genres });
  const handleTagsChange = (tags: string[]) => onChange({ tags });
  const handleAdultChange = (isAdult: boolean | "indeterminate") =>
    onChange({ isAdult: isAdult === true });

  return (
    <>
      <Row gap="m" justifyContent="end">
        <LabeledCombobox
          value={filters.sort}
          className={styles.sort}
          label={t("common:sortLabel")}
          onValueChange={handleSortChange}
          options={sortOptions.map((value) => ({
            value,
            label: t(`common:sort.${value}`),
          }))}
        />
        <Button
          rightIcon={filterIcon}
          onClick={handleOpenDrawer}
          className={styles.filterButton}
        >
          {t("common:ui.filters.open")}
        </Button>
      </Row>

      <Drawer
        fullScreen
        open={open}
        className={styles.drawer}
        onClose={handleCloseDrawer}
      >
        <div className={styles.drawerHeader}>
          <Button
            variant="flat"
            onClick={handleCloseDrawer}
            leftIcon={<ArrowDownIcon />}
            className={styles.backButton}
          >
            {t("common:ui.filters.close")}
          </Button>
          <span className={styles.appliedCount}>
            {t("common:ui.filters.applied", { count })}
          </span>
          <Button size="s" onClick={onReset} className={styles.resetButton}>
            {t("common:ui.filters.resetAll")}
          </Button>
        </div>

        <ScrollArea>
          <Container>
            <Column gap="m" className={styles.drawerContent}>
              <FilterSection title={t("common:list.genres")}>
                <MultiSelect
                  cleanable
                  searchable
                  expandInFlow
                  value={filters.genres}
                  options={genreOptions}
                  id="media-filter-genres"
                  loading={optionsLoading}
                  onValueChange={handleGenresChange}
                  footer={
                    <SelectedValues
                      options={genreOptions}
                      values={filters.genres}
                      onRemove={handleGenreRemove}
                    />
                  }
                />
              </FilterSection>

              <FilterSection title={t("common:list.tags")}>
                <MultiSelect
                  cleanable
                  searchable
                  virtualize
                  expandInFlow
                  value={filters.tags}
                  options={tagOptions}
                  id="media-filter-tags"
                  loading={optionsLoading}
                  onValueChange={handleTagsChange}
                  footer={
                    <SelectedValues
                      options={tagOptions}
                      values={filters.tags}
                      onRemove={handleTagRemove}
                    />
                  }
                />
              </FilterSection>

              <FilterSection title={t("common:ui.filters.status")}>
                {statusFilterOptions.map(({ value, label }) => (
                  <LabeledCheckbox
                    size="l"
                    key={value}
                    checked={filters.statuses.includes(value)}
                    label={t(`common:ui.filters.mediaStatus.${label}`)}
                    onCheckedChange={(checked) =>
                      handleStatusChange(value, checked)
                    }
                    variant={
                      filters.statusMode === "exclude" ? "minus" : "default"
                    }
                    description={
                      savedFilters.statuses.includes(value)
                        ? t("common:ui.filters.default")
                        : undefined
                    }
                  />
                ))}
              </FilterSection>

              <FilterSection title={t("common:ui.filters.format")}>
                {formatFilterOptions.map(({ value, label }) => (
                  <LabeledCheckbox
                    size="l"
                    key={value}
                    checked={filters.formats.includes(value)}
                    label={t(`common:ui.filters.mediaFormat.${label}`)}
                    onCheckedChange={(checked) =>
                      handleFormatChange(value, checked)
                    }
                    variant={
                      filters.formatMode === "exclude" ? "minus" : "default"
                    }
                    description={
                      savedFilters.formats.includes(value)
                        ? t("common:ui.filters.default")
                        : undefined
                    }
                  />
                ))}
              </FilterSection>

              <FilterSection
                title={t("common:ui.filters.source")}
                actions={
                  <div className={styles.modeControls}>
                    {(["include", "exclude"] as const).map((mode, index) => (
                      <Fragment key={mode}>
                        {index > 0 && (
                          <span className={styles.modeSeparator}>/</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSourceModeChange(mode)}
                          className={clsx(styles.modeButton[mode], {
                            [styles.modeButtonActive]:
                              filters.sourceMode === mode,
                          })}
                        >
                          {t(`common:ui.filters.${mode}`)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                }
              >
                {sourceFilterOptions.map(({ value, label }) => (
                  <LabeledCheckbox
                    size="l"
                    key={value}
                    checked={filters.sources.includes(value)}
                    label={t(`common:ui.filters.mediaSource.${label}`)}
                    onCheckedChange={(checked) =>
                      handleSourceChange(value, checked)
                    }
                    variant={
                      filters.sourceMode === "exclude" ? "minus" : "default"
                    }
                    description={
                      savedFilters.sources.includes(value)
                        ? t("common:ui.filters.default")
                        : undefined
                    }
                  />
                ))}
              </FilterSection>

              <FilterSection title={t("common:ui.filters.ageRating")}>
                <LabeledCheckbox
                  size="l"
                  checked={filters.isAdult}
                  onCheckedChange={handleAdultChange}
                  label={t("common:ui.filters.adult")}
                  description={
                    savedFilters.isAdult
                      ? t("common:ui.filters.default")
                      : undefined
                  }
                />
              </FilterSection>
            </Column>
          </Container>
        </ScrollArea>

        <div className={styles.drawerFooter}>
          <Button onClick={handleSaveAndClose} className={styles.saveButton}>
            {t("common:ui.filters.save")}
          </Button>
        </div>
      </Drawer>
    </>
  );
}
