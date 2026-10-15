import type { ReactNode } from "react";
import { memo, useId, useRef, useMemo, useState, useCallback } from "react";

import clsx from "clsx";
import { Popover } from "radix-ui";

import { Spinner } from "../Spinner";
import { ScrollArea } from "../ScrollArea";
import { CloseIcon, ArrowDownIcon } from "../../icons";

import * as styles from "./Combobox.css";

export type ComboboxOption = {
  value: string;
  label: string;
};

export type ComboboxProps = {
  id?: string;
  value?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options: ComboboxOption[];
  onValueChange?: (value: string) => void;
};

export type LabeledComboboxProps = Omit<ComboboxProps, "className"> & {
  label: ReactNode;
  className?: string;
};

type ControllableValueOptions<T> = {
  defaultValue: T;
  value: T | undefined;
  onChange?: (value: T) => void;
};

function useControllableValue<T>({
  value,
  onChange,
  defaultValue,
}: ControllableValueOptions<T>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = useCallback(
    (nextValue: T) => {
      if (Object.is(currentValue, nextValue)) {
        return;
      }

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
}

type OptionItemProps = {
  selected: boolean;
  option: ComboboxOption;
  onSelect: (option: ComboboxOption) => void;
};

const OptionItem = memo(function OptionItem({
  option,
  selected,
  onSelect,
}: OptionItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      onMouseDown={(event) => event.preventDefault()}
      className={clsx(styles.option, { [styles.optionSelected]: selected })}
    >
      {option.label}
    </button>
  );
});

export function Combobox({
  id,
  value,
  options,
  className,
  onValueChange,
  loading = false,
  disabled = false,
  defaultValue = "",
  searchable = false,
  placeholder = "Выберите вариант",
}: ComboboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedValue, setSelectedValue] = useControllableValue({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue],
  );

  const selectedLabel = selectedOption?.label ?? "";

  const filterQuery = searchActive ? query.trim().toLocaleLowerCase() : "";

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLocaleLowerCase().includes(filterQuery),
      ),
    [options, filterQuery],
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSearchActive(false);
  }, []);

  const openMenu = useCallback(() => {
    if (open || disabled || loading) {
      return;
    }

    setQuery(selectedLabel);
    setSearchActive(false);
    setOpen(true);
  }, [open, disabled, loading, selectedLabel]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    },
    [openMenu, closeMenu],
  );

  const toggleMenu = useCallback(() => {
    if (disabled || loading) {
      return;
    }

    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [disabled, loading, open, closeMenu, openMenu]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.currentTarget.value);
      setSearchActive(true);
    },
    [],
  );

  const clearValue = useCallback(() => {
    setSelectedValue("");
    setQuery("");
    setSearchActive(true);
    setOpen(true);

    inputRef.current?.focus();
  }, [setSelectedValue]);

  const selectOption = useCallback(
    (option: ComboboxOption) => {
      setSelectedValue(option.value);
      closeMenu();
    },
    [setSelectedValue, closeMenu],
  );

  return (
    <div className={clsx(styles.root, className)}>
      <Popover.Root open={open} modal={false} onOpenChange={handleOpenChange}>
        <Popover.Anchor asChild>
          <div
            ref={rootRef}
            onClick={toggleMenu}
            className={clsx(styles.trigger, {
              [styles.triggerNotSearchable]:
                !searchable && !disabled && !loading,
            })}
          >
            <input
              id={id}
              ref={inputRef}
              autoComplete="off"
              onChange={handleQueryChange}
              disabled={disabled || loading}
              readOnly={!searchable || loading}
              placeholder={loading ? "Загрузка..." : placeholder}
              value={loading ? "" : open ? query : selectedLabel}
              className={clsx(styles.input, {
                [styles.inputNotSearchable]:
                  !searchable && !disabled && !loading,
              })}
            />

            {loading ? (
              <Spinner className={styles.loadingIcon} />
            ) : (
              <>
                {searchable && (
                  <button
                    type="button"
                    disabled={!open || !query}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                      event.stopPropagation();
                      clearValue();
                    }}
                    className={clsx(styles.clearButton, {
                      [styles.clearButtonHidden]: !open || !query,
                    })}
                  >
                    <CloseIcon className={styles.clearIcon} />
                  </button>
                )}

                <button
                  type="button"
                  disabled={disabled}
                  className={styles.toggleButton}
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
                  <OptionItem
                    option={option}
                    key={option.value}
                    onSelect={selectOption}
                    selected={option.value === selectedValue}
                  />
                ))}

                {filteredOptions.length === 0 && (
                  <div className={styles.empty}>Ничего не найдено</div>
                )}
              </div>
            </ScrollArea>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export function LabeledCombobox({
  label,
  className,
  ...comboboxProps
}: LabeledComboboxProps) {
  const generatedId = useId();
  const inputId = comboboxProps.id ?? generatedId;

  return (
    <div className={clsx(styles.labeled, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <Combobox
        {...comboboxProps}
        id={inputId}
        className={styles.labeledField}
      />
    </div>
  );
}
