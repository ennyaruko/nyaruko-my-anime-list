import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormEvent, ReactElement } from "react";

import {
  Input,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/shared/ui";

import * as styles from "./MediaListValueContextMenu.css";

export type MediaListValueField = "score" | "progress";

export type MediaListValueContextMenuProps = {
  max?: number;
  value: number;
  editable: boolean;
  isSaving?: boolean;
  children: ReactElement;
  field: MediaListValueField;
  onSave: (value: number) => void;
};

export function MediaListValueContextMenu({
  field,
  value,
  onSave,
  children,
  editable,
  max = 12,
  isSaving = false,
}: MediaListValueContextMenuProps) {
  const { t } = useTranslation(["common"]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputId = useId();
  const upperBound = field === "score" ? 10 : max;
  const numericValue = Number(draft);
  const isValidValue =
    Number.isFinite(numericValue) &&
    numericValue >= 0 &&
    numericValue <= upperBound &&
    (field === "score"
      ? Number.isInteger(numericValue * 2)
      : Number.isInteger(numericValue));

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setDraft(String(value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidValue || isSaving) return;

    onSave(numericValue);
    setOpen(false);
  };

  if (!editable) return children;

  return (
    <ContextMenu open={open} onOpenChange={handleOpenChange}>
      <ContextMenuTrigger
        asChild
        onContextMenu={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor={inputId} className={styles.label}>
            {t(
              field === "progress"
                ? "common:progress.label"
                : "common:mediaDetail.score",
            )}
          </label>
          <Input
            min={0}
            autoFocus
            id={inputId}
            type="number"
            value={draft}
            max={upperBound}
            step={field === "score" ? 0.5 : 1}
            onChange={(event) => setDraft(event.currentTarget.value)}
          />
          <Button
            type="submit"
            variant="secondary"
            className={styles.saveButton}
            disabled={!isValidValue || isSaving}
          >
            {t("common:actions.save")}
          </Button>
        </form>
      </ContextMenuContent>
    </ContextMenu>
  );
}
