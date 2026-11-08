import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Popover } from "radix-ui";

import type { MediaFiltersState } from "@/entities/filters";
import type { MediaContentMode, MediaSearchParameters } from "@/entities/media";

import { Row, Button } from "@/shared/ui";
import { SaveIcon, DeleteIcon } from "@/shared/icons";

import type { SearchPosition } from "../model/search-position";
import { createSearchPosition } from "../model/search-position";

import * as styles from "./SearchPositionMenu.css";

export type SearchPositionMenuProps = {
  onClear: VoidFunction;
  filters: MediaFiltersState;
  contentMode: MediaContentMode;
  parameters: MediaSearchParameters;
  savedPosition: null | SearchPosition;
  onSave: (position: SearchPosition) => boolean;
  onRestore: (position: SearchPosition) => void;
  capture: () => null | Pick<SearchPosition, "lastPage" | "lastAnime">;
};

export function SearchPositionMenu(props: SearchPositionMenuProps) {
  return <Menu {...props} />;
}

function Menu({
  onSave,
  onClear,
  capture,
  filters,
  onRestore,
  parameters,
  contentMode,
  savedPosition,
}: SearchPositionMenuProps) {
  const { t } = useTranslation(["common"]);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    const anchor = capture();
    if (!anchor) return;
    const next = createSearchPosition(
      { filters, parameters, contentMode },
      anchor,
    );
    if (onSave(next)) setOpen(false);
  };
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          size="l"
          className={styles.trigger}
          title={t("common:searchPosition.open")}
          leftIcon={<SaveIcon className={styles.triggerIcon} />}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={8}
          className={styles.content}
        >
          <Row wide gap="xxs" alignItem="center" justifyContent="space-between">
            <span className={styles.heading}>
              {t("common:searchPosition.open")}
            </span>
            {savedPosition && (
              <Button
                size="l"
                variant="flat"
                onClick={onClear}
                className={styles.clearButton}
                title={t("common:searchPosition.clear")}
                aria-label={t("common:searchPosition.clear")}
                leftIcon={<DeleteIcon className={styles.clearIcon} />}
              />
            )}
          </Row>
          <Button
            variant="secondary"
            onClick={handleSave}
            className={styles.action}
          >
            {t("common:searchPosition.save")}
          </Button>
          <Button
            variant="primary"
            className={styles.action}
            disabled={!savedPosition}
            onClick={() => {
              if (savedPosition) {
                onRestore(savedPosition);
                setOpen(false);
              }
            }}
          >
            {t("common:searchPosition.restore")}
          </Button>
          {savedPosition && (
            <div className={styles.saved}>
              <span className={styles.savedLabel}>
                {t("common:searchPosition.savedLabel")}
              </span>
              <span className={styles.caption}>
                {t("common:searchPosition.saved", {
                  page: savedPosition.lastPage,
                  anime: savedPosition.lastAnime,
                })}
              </span>
            </div>
          )}
          {!savedPosition && (
            <span className={styles.empty}>
              {t("common:searchPosition.notSaved")}
            </span>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
