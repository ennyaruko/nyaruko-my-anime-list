import { PropsWithChildren } from "react";

import { QueryProvider } from "./QueryProvider";
import { AppAuthProvider } from "./AppAuthProvider";
import { AppServicesProvider } from "./AppServicesProvider";
import { AppDiagnosticsProvider } from "./AppDiagnosticsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <AppDiagnosticsProvider>
      <QueryProvider>
        <AppServicesProvider>
          <AppAuthProvider>{children}</AppAuthProvider>
        </AppServicesProvider>
      </QueryProvider>
    </AppDiagnosticsProvider>
  );
}
