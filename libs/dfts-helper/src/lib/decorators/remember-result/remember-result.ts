/**
 * Remembers method result and caches it
 * <br>Should <b>only</b> be used on <b>pure</b> functions!
 * @since 4.0.0
 */

export function RememberResult(
  hashFn?: (...args: unknown[]) => string
): (target: object, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const cache = new Map<string, string>();

    const ogMethod = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const key = hashFn ? hashFn.apply(this, args) : JSON.stringify(args);

      const cacheEntry = cache.get(key);
      if (cacheEntry) {
        return cacheEntry;
      }

      cache.set(key, ogMethod.apply(this, args));

      return cache.get(key);
    };
    return descriptor;
  };
}
