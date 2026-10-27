import { PropsWithChildren } from "react";

import { ThemeProvider } from "@/features/change-theme";
import { AdultContentProvider } from "@/features/toggle-adult-content";

import { QueryProvider } from "./QueryProvider";
import { AppAuthProvider } from "./AppAuthProvider";
import { AppServicesProvider } from "./AppServicesProvider";
import { AppDiagnosticsProvider } from "./AppDiagnosticsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AdultContentProvider>
        <AppDiagnosticsProvider>
          <QueryProvider>
            <AppServicesProvider>
              <AppAuthProvider>{children}</AppAuthProvider>
            </AppServicesProvider>
          </QueryProvider>
        </AppDiagnosticsProvider>
      </AdultContentProvider>
    </ThemeProvider>
  );
}
