export type ServiceToken<T> = {
  readonly key: symbol;
  readonly name: string;
  /** Compile-time-only marker tying a token to its service type. */
  readonly __serviceType: (service: T) => T;
};

export function createServiceToken<T>(name: string): ServiceToken<T> {
  return { name, key: Symbol(name) } as ServiceToken<T>;
}
