import { PropsWithChildren } from "react";

import { ThemeProvider } from "@/features/change-theme";
import { AdultContentProvider } from "@/features/toggle-adult-content";
import { TranslationPreferencesProvider } from "@/features/translate-content";
import {
  DebugConsoleDialog,
  DebugConsoleProvider,
} from "@/features/debug-console";

import { QueryProvider } from "./QueryProvider";
import { AppAuthProvider } from "./AppAuthProvider";
import { AppServicesProvider } from "./AppServicesProvider";
import { AppDiagnosticsProvider } from "./AppDiagnosticsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <TranslationPreferencesProvider>
        <AdultContentProvider>
          <DebugConsoleProvider>
            <AppDiagnosticsProvider>
              <QueryProvider>
                <AppServicesProvider>
                  <AppAuthProvider>{children}</AppAuthProvider>
                </AppServicesProvider>
              </QueryProvider>
            </AppDiagnosticsProvider>
            <DebugConsoleDialog />
          </DebugConsoleProvider>
        </AdultContentProvider>
      </TranslationPreferencesProvider>
    </ThemeProvider>
  );
}
