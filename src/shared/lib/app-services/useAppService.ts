import { useContext } from "react";

import type { ServiceToken } from "./service-token";
import { AppServicesContext } from "./app-services-context";

/** Resolve a registered service by its typed token and fail fast if it is absent. */
export function useAppService<T>(token: ServiceToken<T>): T {
  const services = useContext(AppServicesContext);
  if (!services) {
    throw new Error("AppServicesContextProvider is missing");
  }
  if (!services.has(token.key)) {
    throw new Error(`Application service is not registered: ${token.name}`);
  }
  return services.get(token.key) as T;
}
