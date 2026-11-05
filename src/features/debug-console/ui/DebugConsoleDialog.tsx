import { useTranslation } from "react-i18next";

import { Dialog } from "radix-ui";

import { Button } from "@/shared/ui";

import { useDebugConsole } from "../model";

import * as styles from "./DebugConsoleDialog.css";

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString();
}

export function DebugConsoleDialog() {
  const { t } = useTranslation(["common"]);
  const { isOpen, entries, clearEntries, closeConsole } = useDebugConsole();

  const handleCopy = async () => {
    const content = entries
      .map(
        ({ level, message, timestamp }) =>
          `[${formatTimestamp(timestamp)}] ${level.toUpperCase()} ${message}`,
      )
      .join("\n");
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Clipboard access can be unavailable outside secure browser contexts.
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeConsole()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.heading}>
            <Dialog.Title className={styles.title}>
              {t("common:debugConsole.title")}
            </Dialog.Title>
            <span className={styles.count}>
              {t("common:debugConsole.entryCount", { count: entries.length })}
            </span>
          </div>
          <Dialog.Description className={styles.count}>
            {t("common:debugConsole.description")}
          </Dialog.Description>
          <div className={styles.actions}>
            <Button
              variant="flat"
              onClick={handleCopy}
              disabled={!entries.length}
            >
              {t("common:debugConsole.copy")}
            </Button>
            <Button
              variant="flat"
              onClick={clearEntries}
              disabled={!entries.length}
            >
              {t("common:debugConsole.clear")}
            </Button>
            <Dialog.Close asChild>
              <Button>{t("common:debugConsole.close")}</Button>
            </Dialog.Close>
          </div>
          <div className={styles.entries}>
            {entries.length ? (
              entries
                .slice()
                .reverse()
                .map(({ id, level, message, timestamp }) => (
                  <div key={id} className={styles.entry}>
                    <span className={styles.timestamp}>
                      {formatTimestamp(timestamp)}
                    </span>
                    <pre className={`${styles.message} ${styles.level[level]}`}>
                      {level.toUpperCase()} {message}
                    </pre>
                  </div>
                ))
            ) : (
              <p className={styles.empty}>{t("common:debugConsole.empty")}</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
