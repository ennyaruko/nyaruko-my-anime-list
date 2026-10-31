import { useRouteError, isRouteErrorResponse } from "react-router";

import { ErrorFallback, BlockStatusNotFound } from "@/shared/ui";

import * as styles from "./ErrorBoundary.css";

export function GlobalErrorFallback() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  if (isNotFound) {
    return (
      <main className={styles.globalErrorFallback}>
        <div className={styles.content}>
          <BlockStatusNotFound />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.globalErrorFallback}>
      <div className={styles.content}>
        <ErrorFallback size="l" showReload />
      </div>
    </main>
  );
}
