import type { PropsWithChildren } from "react";
import {
  ErrorBoundary as LibraryErrorBoundary,
  type ErrorBoundaryProps as LibraryErrorBoundaryProps,
} from "react-error-boundary";

import { ErrorFallback } from "./ErrorFallback";

export type ComponentErrorBoundaryProps = PropsWithChildren<{
  size?: "m" | "l";
  className?: string;
  onError?: LibraryErrorBoundaryProps["onError"];
  onReset?: LibraryErrorBoundaryProps["onReset"];
  resetKeys?: LibraryErrorBoundaryProps["resetKeys"];
}>;

export function ComponentErrorBoundary({
  onError,
  onReset,
  children,
  resetKeys,
  className,
  size = "m",
}: ComponentErrorBoundaryProps) {
  return (
    <LibraryErrorBoundary
      onError={onError}
      onReset={onReset}
      resetKeys={resetKeys}
      fallbackRender={({ resetErrorBoundary }) => (
        <ErrorFallback
          showRetry
          size={size}
          className={className}
          onRetry={resetErrorBoundary}
        />
      )}
    >
      {children}
    </LibraryErrorBoundary>
  );
}
