/**
 * Delay method call for x milliseconds
 * @param ms {number} Milliseconds which the method call should be delayed
 * @since 4.0.0
 */
export function Delay(ms: number): (target: object, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const ogMethod = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      setTimeout(() => {
        return ogMethod.apply(this, args);
      }, ms);
    };
    return descriptor;
  };
}
