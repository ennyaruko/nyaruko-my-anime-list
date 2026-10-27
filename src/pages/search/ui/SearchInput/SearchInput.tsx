import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/ui";
import { SearchIcon } from "@/shared/icons";
import { SEARCH_INPUT_FOCUS_EVENT } from "@/shared/lib";

import * as styles from "./SearchInput.css";

type SearchInputProps = { value: string; onChange: (value: string) => void };
export function SearchInput({ value, onChange }: SearchInputProps) {
  const { t } = useTranslation(["common"]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    searchInputRef.current?.focus();
    const focusSearchInput = () => searchInputRef.current?.focus();
    window.addEventListener(SEARCH_INPUT_FOCUS_EVENT, focusSearchInput);
    return () =>
      window.removeEventListener(SEARCH_INPUT_FOCUS_EVENT, focusSearchInput);
  }, []);

  return (
    <Input
      cleanable
      value={value}
      autoComplete="off"
      variant="grayscale"
      inputRef={searchInputRef}
      onClear={() => onChange("")}
      placeholder={t("common:search.placeholder")}
      leftSlot={<SearchIcon className={styles.searchIcon} />}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
