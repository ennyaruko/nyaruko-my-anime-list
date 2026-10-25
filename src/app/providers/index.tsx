import { PropsWithChildren } from "react";

import { ThemeProvider } from "@/features/change-theme";

import { QueryProvider } from "./QueryProvider";
import { AppAuthProvider } from "./AppAuthProvider";
import { AppServicesProvider } from "./AppServicesProvider";
import { AppDiagnosticsProvider } from "./AppDiagnosticsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AppDiagnosticsProvider>
        <QueryProvider>
          <AppServicesProvider>
            <AppAuthProvider>{children}</AppAuthProvider>
          </AppServicesProvider>
        </QueryProvider>
      </AppDiagnosticsProvider>
    </ThemeProvider>
  );
}
