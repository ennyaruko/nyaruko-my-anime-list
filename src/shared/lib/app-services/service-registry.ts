import type { ServiceToken } from "./service-token";
import type { ServiceRegistry } from "./app-services-context";

export type ServiceRegistryBuilder = {
  build(): ServiceRegistry;
  register<T>(token: ServiceToken<T>, service: T): ServiceRegistryBuilder;
};

/**
 * Build the app's service registry with type checking at each registration.
 * Runtime storage is intentionally hidden behind the typed registration API.
 */
export function createServiceRegistry(): ServiceRegistryBuilder {
  const services = new Map<symbol, unknown>();

  const builder: ServiceRegistryBuilder = {
    build() {
      return new Map(services);
    },
    register<T>(token: ServiceToken<T>, service: T) {
      if (services.has(token.key)) {
        throw new Error(
          `Application service is already registered: ${token.name}`,
        );
      }
      services.set(token.key, service);
      return builder;
    },
  };

  return builder;
}
