import type { ReactNode } from "react";

import { AppServicesContext } from "./app-services-context";
import type { ServiceRegistry } from "./app-services-context";

export type AppServicesContextProviderProps = {
  children: ReactNode;
  services: ServiceRegistry;
};

export function AppServicesContextProvider({
  services,
  children,
}: AppServicesContextProviderProps) {
  return (
    <AppServicesContext.Provider value={services}>
      {children}
    </AppServicesContext.Provider>
  );
}
