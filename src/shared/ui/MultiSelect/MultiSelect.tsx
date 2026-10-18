import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useRef, useMemo, useState, useCallback } from "react";

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
  cleanable?: boolean;
  searchable?: boolean;
  placeholder?: string;
  defaultValue?: string[];
  options: MultiSelectOption[];
  onValueChange?: (value: string[]) => void;
};

export type LabeledMultiSelectProps = Omit<MultiSelectProps, "className"> & {
  label: ReactNode;
  className?: string;
};

export function MultiSelect({
  id,
  value,
  options,
  className,
  placeholder,
  defaultValue,
  onValueChange,
  loading = false,
  disabled = false,
  cleanable = false,
  searchable = false,
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
  const selectedLabels = useMemo(
    () =>
      options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label)
        .join(", "),
    [options, selectedValues],
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

  return (
    <div className={clsx(styles.root, className)}>
      <Popover.Root
        open={open}
        modal={false}
        onOpenChange={(nextOpen) => (nextOpen ? openMenu() : closeMenu())}
      >
        <Popover.Anchor asChild>
          <div
            ref={rootRef}
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
              onClick={toggleMenu}
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
                  className={styles.iconButton}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleMenu();
                  }}
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

              if (target instanceof Node && rootRef.current?.contains(target)) {
                event.preventDefault();
              }
            }}
          >
            <ScrollArea>
              <div className={styles.options}>
                {filteredOptions.map((option) => (
                  <LabeledCheckbox
                    size="l"
                    key={option.value}
                    disabled={disabled}
                    label={option.label}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={(checked) =>
                      toggleOption(option.value, checked)
                    }
                    className={clsx(styles.optionCheckbox, {
                      [styles.optionCheckboxSelected]: selectedValues.includes(
                        option.value,
                      ),
                    })}
                  />
                ))}
                {filteredOptions.length === 0 && (
                  <div className={styles.empty}>{t("common:emptyResults")}</div>
                )}
              </div>
            </ScrollArea>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
