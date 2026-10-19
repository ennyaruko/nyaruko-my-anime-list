import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { Button } from "../Button";
import { Column } from "../Layout";

import * as styles from "./ErrorBoundary.css";

export type ErrorFallbackProps = {
  title?: string;
  size?: "m" | "l";
  className?: string;
  showRetry?: boolean;
  description?: string;
  showReload?: boolean;
  onRetry?: VoidFunction;
  onReload?: VoidFunction;
};

export function ErrorFallback({
  title,
  onRetry,
  onReload,
  className,
  size = "m",
  description,
  showRetry = false,
  showReload = false,
}: ErrorFallbackProps) {
  const { t } = useTranslation(["common"]);

  const handleReload = () => {
    if (onReload) {
      onReload();
      return;
    }

    window.location.reload();
  };

  return (
    <section
      role="alert"
      className={clsx(styles.root, styles.size[size], className)}
    >
      <img
        src="/images/critical.png"
        alt={title ?? t("common:errorBoundary.title")}
        className={clsx(styles.illustration, styles.illustrationSize[size])}
      />
      <Column gap="s" alignItem="center">
        <h2 className={styles.title}>
          {title ?? t("common:errorBoundary.title")}
        </h2>
        <p className={styles.description}>
          {description ?? t("common:errorBoundary.description")}
        </p>
        {showRetry && (
          <Button onClick={onRetry} variant="secondary">
            {t("common:errorBoundary.retry")}
          </Button>
        )}
        {showReload && (
          <Button variant="secondary" onClick={handleReload}>
            {t("common:errorBoundary.reload")}
          </Button>
        )}
      </Column>
    </section>
  );
}
