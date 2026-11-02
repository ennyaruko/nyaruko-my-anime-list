import { useTranslation } from "react-i18next";

import { Dialog } from "radix-ui";

import { Button } from "@/shared/ui";

import * as styles from "./AdultContentConfirmationDialog.css";

export type AdultContentConfirmationDialogProps = {
  open: boolean;
  pending: boolean;
  onCancel: VoidFunction;
  onConfirm: VoidFunction;
};

export function AdultContentConfirmationDialog({
  open,
  pending,
  onCancel,
  onConfirm,
}: AdultContentConfirmationDialogProps) {
  const { t } = useTranslation(["common"]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !pending) onCancel();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            {t("common:profileMenu.adultContentConfirmTitle")}
          </Dialog.Title>
          <Dialog.Description className={styles.description}>
            {t("common:profileMenu.adultContentConfirmDescription")}
          </Dialog.Description>
          <div className={styles.actions}>
            <Dialog.Close asChild>
              <Button variant="flat" disabled={pending}>
                {t("common:profileMenu.adultContentConfirmCancel")}
              </Button>
            </Dialog.Close>
            <Button disabled={pending} onClick={onConfirm}>
              {t("common:profileMenu.adultContentConfirmAccept")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
