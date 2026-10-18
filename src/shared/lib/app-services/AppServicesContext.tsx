import { useContext, createContext, type ReactNode } from "react";

/**
 * A dependency-injection boundary that stays in shared so lower FSD layers
 * can consume app-provided services without importing from app/.
 *
 * shared deliberately does not know the shape of the application's services.
 * The composition root types the registry; consumers request the narrow shape
 * they need using useAppServices<T>().
 */
const AppServicesContext = createContext<unknown>(null);

export type AppServicesContextProviderProps = {
  services: object;
  children: ReactNode;
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

/**
 * Read services from the app composition root.
 * T is supplied by the consumer and should be the narrowest required shape.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAppServices<T extends object>(): T {
  const services = useContext(AppServicesContext);

  if (services === null || typeof services !== "object") {
    throw new Error("AppServicesContextProvider is missing");
  }

  return services as T;
}
