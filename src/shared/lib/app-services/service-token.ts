declare const serviceType: unique symbol;

/** A runtime service key with a compile-time association to its contract. */
export type ServiceToken<T> = {
  readonly key: symbol;
  readonly name: string;
  readonly [serviceType]: (service: T) => T;
};

export function createServiceToken<T>(name: string): ServiceToken<T> {
  return { name, key: Symbol(name) } as ServiceToken<T>;
}
