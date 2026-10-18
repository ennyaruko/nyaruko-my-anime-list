import { createContext } from "react";

export type ServiceRegistry = ReadonlyMap<symbol, unknown>;

export const AppServicesContext = createContext<null | ServiceRegistry>(null);
