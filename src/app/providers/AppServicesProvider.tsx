import type { ReactNode } from "react";

import { appServices } from "@/app/services";

import { AppServicesContextProvider } from "@/shared/lib/app-services";

export function AppServicesProvider({ children }: { children: ReactNode }) {
  return (
    <AppServicesContextProvider services={appServices}>
      {children}
    </AppServicesContextProvider>
  );
}
