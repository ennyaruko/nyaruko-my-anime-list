import { useTranslation } from "react-i18next";

import { Input } from "@/shared/ui";
import { SearchIcon } from "@/shared/icons";

import * as styles from "./SearchInput.css";

type SearchInputProps = { value: string; onChange: (value: string) => void };
export function SearchInput({ value, onChange }: SearchInputProps) {
  const { t } = useTranslation(["common"]);

  return (
    <Input
      cleanable
      value={value}
      autoComplete="off"
      variant="grayscale"
      onClear={() => onChange("")}
      placeholder={t("common:search.placeholder")}
      leftSlot={<SearchIcon className={styles.searchIcon} />}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
