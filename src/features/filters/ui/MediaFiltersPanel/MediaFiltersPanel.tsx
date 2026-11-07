import type { ReactNode } from "react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { isAdultContentMode } from "@/entities/media";
import type { MediaContentMode } from "@/entities/media";
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
  Header,
  Heading,
  Container,
  ScrollArea,
  MultiSelect,
  LabeledRadio,
  ModeControls,
  LabeledCheckbox,
  LabeledCombobox,
  showNotification,
} from "@/shared/ui";

import { filterTagsForContentMode } from "../../model/filter-tags-for-content-mode";
import {
  formatFilterOptions,
  sourceFilterOptions,
  statusFilterOptions,
  getYearFilterOptions,
} from "../../model/media-filter-options";

import * as styles from "./MediaFiltersPanel.css";

export type MediaFiltersPanelProps = {
  open?: boolean;
  onSave: VoidFunction;
  onReset: VoidFunction;
  options?: FilterOptions;
  optionsLoading?: boolean;
  filters: MediaFiltersState;
  hasUnsavedChanges: boolean;
  contentMode?: MediaContentMode;
  savedFilters: MediaFiltersState;
  sortOptions: readonly MediaSortKey[];
  onOpenChange?: (open: boolean) => void;
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
  onOpenChange,
  hasUnsavedChanges,
  contentMode = "safe",
  open: controlledOpen,
  optionsLoading = false,
}: MediaFiltersPanelProps) {
  const { t } = useTranslation(["common"]);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  const count =
    countSelectedValues(filters) + Number(filters.yearRange !== null);
  const filterIcon = hasUnsavedChanges ? (
    <FilterCheckedIcon className={styles.checkedFilterIcon} />
  ) : (
    <FilterIcon />
  );
  const genreOptions = options?.genres ?? [];
  const includeAdultTags = isAdultContentMode(contentMode);
  const visibleTags = filterTagsForContentMode(
    filters.tags,
    options,
    contentMode,
  );
  const tagOptions =
    options?.tags
      .filter((tag) => includeAdultTags || tag.isAdult === false)
      .map(({ value, label }) => ({ value, label })) ?? [];

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
  const yearOptions = getYearFilterOptions(new Date().getFullYear(), (key) =>
    t(`common:ui.filters.yearOptions.${key}`),
  );
  const handleGenreRemove = (value: string) =>
    onChange({ genres: filters.genres.filter((genre) => genre !== value) });
  const handleTagRemove = (value: string) =>
    onChange({ tags: filters.tags.filter((tag) => tag !== value) });
  const handleGenresChange = (genres: string[]) => onChange({ genres });
  const handleTagsChange = (tags: string[]) => onChange({ tags });

  return (
    <>
      <Row gap="m" justifyContent="end" className={styles.toolbar}>
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

      <Drawer open={open} className={styles.drawer} onClose={handleCloseDrawer}>
        <Header
          trailing={
            <Button size="s" onClick={onReset}>
              {t("common:ui.filters.resetAll")}
            </Button>
          }
          center={
            <span className={styles.appliedCount}>
              {t("common:ui.filters.applied", { count })}
            </span>
          }
          leading={
            <Button
              variant="flat"
              onClick={handleCloseDrawer}
              leftIcon={<ArrowDownIcon />}
            >
              {t("common:ui.filters.close")}
            </Button>
          }
        />

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
                  value={visibleTags}
                  options={tagOptions}
                  id="media-filter-tags"
                  loading={optionsLoading}
                  onValueChange={handleTagsChange}
                  footer={
                    <SelectedValues
                      options={tagOptions}
                      values={visibleTags}
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
                  <ModeControls
                    value={filters.sourceMode}
                    onChange={handleSourceModeChange}
                    options={(["include", "exclude"] as const).map((mode) => ({
                      value: mode,
                      label: t(`common:ui.filters.${mode}`),
                    }))}
                  />
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

              <FilterSection title={t("common:ui.filters.year")}>
                {yearOptions.map(({ value, label, range }) => (
                  <LabeledRadio
                    size="l"
                    key={value}
                    label={label}
                    checked={
                      filters.yearRange?.fromYear === range.fromYear &&
                      filters.yearRange?.toYear === range.toYear
                    }
                    onCheckedChange={(checked) =>
                      onChange({
                        yearRange: checked === true ? range : null,
                      })
                    }
                  />
                ))}
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
