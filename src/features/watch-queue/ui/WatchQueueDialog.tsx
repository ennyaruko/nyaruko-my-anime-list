import { useTranslation } from "react-i18next";

import { Dialog } from "radix-ui";

import type { Media } from "@/entities/media";
import { MediaDetailLink } from "@/entities/media";

import { Image, Button } from "@/shared/ui";
import { DeleteIcon, PlanningIcon } from "@/shared/icons";

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
              <WatchQueueItem selected media={selectedMedia} />
            </section>
          )}
          <div className={styles.actions}>
            <Button
              variant="secondary"
              disabled={!hasItems}
              onClick={onPickRandom}
              leftIcon={<PlanningIcon />}
            >
              {t("common:watchQueue.random")}
            </Button>
            <Button variant="flat" onClick={onClear} disabled={!hasItems}>
              {t("common:watchQueue.clear")}
            </Button>
            <Dialog.Close asChild>
              <Button>{t("common:debugConsole.close")}</Button>
            </Dialog.Close>
          </div>
          <div className={styles.list}>
            {hasItems ? (
              items.map((media) => (
                <div
                  key={media.id}
                  className={styles.item}
                  data-selected={selectedMedia?.id === media.id}
                >
                  <WatchQueueItem media={media} />
                  <Button
                    size="l"
                    variant="flat"
                    className={styles.removeButton}
                    onClick={() => onRemove(media.id)}
                    title={t("common:watchQueue.remove")}
                    leftIcon={<DeleteIcon className={styles.removeIcon} />}
                  />
                </div>
              ))
            ) : (
              <p className={styles.empty}>{t("common:watchQueue.empty")}</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type WatchQueueItemProps = {
  media: Media;
  selected?: boolean;
};

function WatchQueueItem({ media, selected = false }: WatchQueueItemProps) {
  const { t } = useTranslation(["common"]);
  const coverUrl = media.coverImage?.large ?? media.coverImage?.preview;

  return (
    <MediaDetailLink
      media={media}
      className={styles.mediaLink}
      title={selected ? t("common:watchQueue.openSelectedAnime") : undefined}
    >
      <div className={styles.cover}>
        <Image
          loading="lazy"
          imageClassName={styles.image}
          alt={coverUrl ? media.title : ""}
          image={{
            url:
              coverUrl ??
              `${import.meta.env.BASE_URL}images/media-no-image.png`,
          }}
        />
      </div>
      <span className={styles.mediaTitle}>{media.title}</span>
    </MediaDetailLink>
  );
}
