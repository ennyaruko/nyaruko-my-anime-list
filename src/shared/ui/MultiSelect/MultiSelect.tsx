import type { ReactNode } from "react";
import { Virtuoso } from "react-virtuoso";
import { useTranslation } from "react-i18next";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";

import clsx from "clsx";
import { Popover } from "radix-ui";

import { Spinner } from "../Spinner";
import { ScrollArea } from "../ScrollArea";
import { LabeledCheckbox } from "../Checkbox";
import { CloseIcon, ArrowDownIcon } from "../../icons";

import * as styles from "./MultiSelect.css";

export type MultiSelectOption = {
  value: string;
  label: string;
};

export type MultiSelectProps = {
  id?: string;
  value?: string[];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  footer?: ReactNode;
  cleanable?: boolean;
  searchable?: boolean;
  virtualize?: boolean;
  placeholder?: string;
  expandInFlow?: boolean;
  defaultValue?: string[];
  options: MultiSelectOption[];
  onValueChange?: (value: string[]) => void;
};

export type LabeledMultiSelectProps = Omit<MultiSelectProps, "className"> & {
  label: ReactNode;
  className?: string;
};

type VirtualizedOptionsProps = {
  disabled: boolean;
  scrollResetKey: string;
  options: MultiSelectOption[];
  selectedValues: ReadonlySet<string>;
  onToggleOption: (value: string, checked: boolean | "indeterminate") => void;
};

function VirtualizedOptions({
  options,
  disabled,
  selectedValues,
  scrollResetKey,
  onToggleOption,
}: VirtualizedOptionsProps) {
  const { t } = useTranslation(["common"]);
  const [viewportElement, setViewportElement] = useState<null | HTMLDivElement>(
    null,
  );
  const [listHeight, setListHeight] = useState(0);
  const viewportHeight = Math.min(
    150,
    Math.max(44, listHeight || options.length * 44),
  );

  useEffect(() => {
    viewportElement?.scrollTo({ top: 0 });
  }, [scrollResetKey, viewportElement]);

  useEffect(() => {
    setListHeight(Math.min(150, Math.max(44, options.length * 44)));
  }, [options]);

  return (
    <div className={styles.virtualViewport} style={{ height: viewportHeight }}>
      <ScrollArea
        viewportRef={setViewportElement}
        className={styles.virtualScrollArea}
        viewportClassName={styles.virtualScrollViewport}
      >
        {options.length > 0 ? (
          viewportElement && (
            <Virtuoso
              data={options}
              defaultItemHeight={44}
              customScrollParent={viewportElement}
              computeItemKey={(_, option) => option.value}
              totalListHeightChanged={(height) => setListHeight(height)}
              itemContent={(_, option) => {
                const checked = selectedValues.has(option.value);

                return (
                  <LabeledCheckbox
                    size="l"
                    checked={checked}
                    disabled={disabled}
                    label={option.label}
                    onCheckedChange={(nextChecked) =>
                      onToggleOption(option.value, nextChecked)
                    }
                    className={clsx(styles.optionCheckbox, {
                      [styles.optionCheckboxSelected]: checked,
                    })}
                  />
                );
              }}
            />
          )
        ) : (
          <div className={styles.empty}>{t("common:emptyResults")}</div>
        )}
      </ScrollArea>
    </div>
  );
}

export function MultiSelect({
  id,
  value,
  footer,
  options,
  className,
  placeholder,
  defaultValue,
  onValueChange,
  loading = false,
  disabled = false,
  cleanable = false,
  searchable = false,
  virtualize = false,
  expandInFlow = false,
}: MultiSelectProps) {
  const { t } = useTranslation(["common"]);
  const effectivePlaceholder =
    placeholder ?? t("common:multiSelect.placeholder");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue ?? []);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedValues = value ?? internalValue;
  const selectedValueSet = useMemo(
    () => new Set(selectedValues),
    [selectedValues],
  );
  const selectedLabels = useMemo(
    () =>
      options
        .filter((option) => selectedValueSet.has(option.value))
        .map((option) => option.label)
        .join(", "),
    [options, selectedValueSet],
  );
  const filteredOptions = useMemo(() => {
    const filter = query.trim().toLocaleLowerCase();

    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(filter),
    );
  }, [options, query]);
  const openMenu = useCallback(() => {
    if (disabled || loading) return;

    setOpen(true);
  }, [disabled, loading]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const toggleMenu = useCallback(() => {
    if (disabled || loading) return;

    if (open) closeMenu();
    else openMenu();
  }, [disabled, loading, open, closeMenu, openMenu]);

  const setSelectedValues = useCallback(
    (nextValue: string[]) => {
      if (value === undefined) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  const toggleOption = useCallback(
    (optionValue: string, checked: boolean | "indeterminate") => {
      const nextValues =
        checked === true
          ? [...selectedValues, optionValue]
          : selectedValues.filter(
              (selectedValue) => selectedValue !== optionValue,
            );

      setSelectedValues(nextValues);
    },
    [selectedValues, setSelectedValues],
  );

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.currentTarget.value);
    },
    [],
  );

  const handleArrowClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (open && searchable) inputRef.current?.blur();
      toggleMenu();
    },
    [open, searchable, toggleMenu],
  );

  const clearSelection = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setSelectedValues([]);
      setQuery("");
      setOpen(true);
      inputRef.current?.focus();
    },
    [setSelectedValues],
  );

  useEffect(() => {
    if (!open || !expandInFlow) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        closeMenu();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, expandInFlow, open]);

  const optionsContent = virtualize ? (
    <VirtualizedOptions
      disabled={disabled}
      scrollResetKey={query}
      options={filteredOptions}
      onToggleOption={toggleOption}
      selectedValues={selectedValueSet}
    />
  ) : (
    <ScrollArea>
      <div className={styles.options}>
        {filteredOptions.map((option) => {
          const checked = selectedValueSet.has(option.value);

          return (
            <LabeledCheckbox
              size="l"
              checked={checked}
              key={option.value}
              disabled={disabled}
              label={option.label}
              onCheckedChange={(nextChecked) =>
                toggleOption(option.value, nextChecked)
              }
              className={clsx(styles.optionCheckbox, {
                [styles.optionCheckboxSelected]: checked,
              })}
            />
          );
        })}
        {filteredOptions.length === 0 && (
          <div className={styles.empty}>{t("common:emptyResults")}</div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div ref={rootRef} className={clsx(styles.root, className)}>
      <Popover.Root
        open={open}
        modal={false}
        onOpenChange={(nextOpen) => (nextOpen ? openMenu() : closeMenu())}
      >
        <Popover.Anchor asChild>
          <div
            onClick={(event) => {
              if (event.target === event.currentTarget) toggleMenu();
            }}
            className={clsx(styles.trigger, {
              [styles.triggerNotSearchable]:
                !searchable && !disabled && !loading,
            })}
          >
            <input
              id={id}
              ref={inputRef}
              autoComplete="off"
              onClick={openMenu}
              onChange={handleQueryChange}
              disabled={disabled || loading}
              readOnly={!searchable || loading}
              placeholder={loading ? t("common:loading") : effectivePlaceholder}
              value={loading ? "" : open && searchable ? query : selectedLabels}
              className={clsx(styles.input, {
                [styles.inputNotSearchable]:
                  !searchable && !disabled && !loading,
              })}
            />

            {loading ? (
              <Spinner className={styles.icon} />
            ) : (
              <>
                {(searchable || cleanable) && open && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    aria-label={t("common:actions.clearSelection")}
                    onPointerDown={(event) => event.preventDefault()}
                    className={clsx(styles.iconButton, {
                      [styles.clearButtonHidden]: selectedValues.length === 0,
                    })}
                  >
                    <CloseIcon className={styles.clearIcon} />
                  </button>
                )}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleArrowClick}
                  className={styles.iconButton}
                  onPointerDown={(event) => event.preventDefault()}
                >
                  <ArrowDownIcon
                    className={clsx(styles.chevron, {
                      [styles.chevronOpen]: open,
                    })}
                  />
                </button>
              </>
            )}
          </div>
        </Popover.Anchor>

        {expandInFlow ? (
          open && <div className={styles.inlineContent}>{optionsContent}</div>
        ) : (
          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={0}
              collisionPadding={8}
              className={styles.content}
              onOpenAutoFocus={(event) => event.preventDefault()}
              style={{ width: "var(--radix-popper-anchor-width)" }}
              onInteractOutside={(event) => {
                const target = event.target;

                if (
                  target instanceof Node &&
                  rootRef.current?.contains(target)
                ) {
                  event.preventDefault();
                }
              }}
            >
              {optionsContent}
            </Popover.Content>
          </Popover.Portal>
        )}
      </Popover.Root>
      {footer}
    </div>
  );
}
