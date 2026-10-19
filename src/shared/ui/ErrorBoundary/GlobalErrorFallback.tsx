import { useTranslation } from "react-i18next";
import { useRouteError, isRouteErrorResponse } from "react-router";

import { ErrorFallback } from "@/shared/ui";

import * as styles from "./ErrorBoundary.css";

export function GlobalErrorFallback() {
  const error = useRouteError();
  const { t } = useTranslation(["common"]);
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className={styles.globalErrorFallback}>
      <div className={styles.content}>
        <ErrorFallback
          size="l"
          showReload
          title={
            isNotFound ? t("common:errorBoundary.notFoundTitle") : undefined
          }
          description={
            isNotFound
              ? t("common:errorBoundary.notFoundDescription")
              : undefined
          }
        />
      </div>
    </main>
  );
}
