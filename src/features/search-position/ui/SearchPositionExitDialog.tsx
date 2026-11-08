import { useTranslation } from "react-i18next";

import { Dialog } from "radix-ui";

import { Button } from "@/shared/ui";

import * as styles from "./SearchPositionExitDialog.css";

export type SearchPositionExitDialogProps = {
  open: boolean;
  onStay: VoidFunction;
  onLeave: VoidFunction;
  onSaveAndLeave: VoidFunction;
};

export function SearchPositionExitDialog({
  open,
  onStay,
  onLeave,
  onSaveAndLeave,
}: SearchPositionExitDialogProps) {
  const { t } = useTranslation(["common"]);

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onStay()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            {t("common:searchPosition.exitTitle")}
          </Dialog.Title>
          <Dialog.Description className={styles.description}>
            {t("common:searchPosition.exitDescription")}
          </Dialog.Description>
          <div className={styles.actions}>
            <Button variant="flat" onClick={onStay}>
              {t("common:searchPosition.stay")}
            </Button>
            <Button onClick={onLeave}>
              {t("common:searchPosition.leaveWithoutSaving")}
            </Button>
            <Button variant="secondary" onClick={onSaveAndLeave}>
              {t("common:searchPosition.saveAndLeave")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
