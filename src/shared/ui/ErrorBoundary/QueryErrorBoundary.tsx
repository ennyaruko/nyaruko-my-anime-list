import { QueryErrorResetBoundary } from "@tanstack/react-query";

import {
  ComponentErrorBoundary,
  type ComponentErrorBoundaryProps,
} from "./ComponentErrorBoundary";

export type QueryErrorBoundaryProps = ComponentErrorBoundaryProps;

export function QueryErrorBoundary({
  onReset,
  children,
  ...props
}: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ComponentErrorBoundary
          {...props}
          onReset={(details) => {
            reset();
            onReset?.(details);
          }}
        >
          {children}
        </ComponentErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
