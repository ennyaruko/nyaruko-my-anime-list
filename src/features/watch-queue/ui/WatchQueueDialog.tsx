import { useTranslation } from "react-i18next";

import { Dialog } from "radix-ui";

import { type Media, CompactCard } from "@/entities/media";

import { Row, Button, Column, ScrollArea } from "@/shared/ui";
import { DeleteIcon, RepeatIcon, PlanningIcon } from "@/shared/icons";

import * as styles from "./WatchQueueDialog.css";

export type WatchQueueDialogProps = {
  items: Media[];
  isOpen: boolean;
  onOpen: VoidFunction;
  onClear: VoidFunction;
  onClose: VoidFunction;
  onPickRandom: VoidFunction;
  selectedMedia: null | Media;
  onRemove: (mediaId: number) => void;
};

export function WatchQueueDialog({
  items,
  isOpen,
  onOpen,
  onClear,
  onClose,
  onRemove,
  onPickRandom,
  selectedMedia,
}: WatchQueueDialogProps) {
  const { t } = useTranslation(["common"]);
  const hasItems = items.length > 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {hasItems && (
        <Button
          size="l"
          onClick={onOpen}
          className={styles.floatingButton}
          title={t("common:watchQueue.open")}
          leftIcon={<PlanningIcon className={styles.floatingIcon} />}
        >
          <span className={styles.badge}>{items.length}</span>
        </Button>
      )}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.heading}>
            <Dialog.Title className={styles.title}>
              {t("common:watchQueue.title")}
            </Dialog.Title>
            <span className={styles.count}>
              {t("common:watchQueue.itemCount", { count: items.length })}
            </span>
          </div>
          {selectedMedia && (
            <section className={styles.selected}>
              <span className={styles.selectedLabel}>
                {t("common:watchQueue.selected")}
              </span>
              <CompactCard media={selectedMedia} className={styles.queueCard} />
            </section>
          )}
          <Row wide gap="xxs" justifyContent="space-between">
            <Button
              variant="secondary"
              disabled={!hasItems}
              onClick={onPickRandom}
              leftIcon={<RepeatIcon />}
            >
              {t("common:watchQueue.random")}
            </Button>
            <Row gap="xxs">
              <Button variant="flat" onClick={onClear} disabled={!hasItems}>
                {t("common:watchQueue.clear")}
              </Button>
              <Dialog.Close asChild>
                <Button>{t("common:debugConsole.close")}</Button>
              </Dialog.Close>
            </Row>
          </Row>
          <ScrollArea
            className={styles.list}
            viewportClassName={styles.listViewport}
          >
            {hasItems ? (
              <Column gap="xxs">
                {items.map((media) => (
                  <div
                    key={media.id}
                    className={styles.item}
                    data-selected={selectedMedia?.id === media.id}
                  >
                    <CompactCard media={media} className={styles.queueCard} />
                    <Button
                      size="l"
                      variant="flat"
                      className={styles.removeButton}
                      onClick={() => onRemove(media.id)}
                      title={t("common:watchQueue.remove")}
                      leftIcon={<DeleteIcon className={styles.removeIcon} />}
                    />
                  </div>
                ))}
              </Column>
            ) : (
              <p className={styles.empty}>{t("common:watchQueue.empty")}</p>
            )}
          </ScrollArea>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
