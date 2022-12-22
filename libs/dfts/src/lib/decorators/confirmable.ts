/**
 * Adds confirm dialog before function call
 * @since 4.0.2
 */
export function Confirmable(message: string): (target: object, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const original = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const allow = confirm(message);

      if (allow) {
        return original.apply(this, args);
      } else {
        return null;
      }
    };

    return descriptor;
  };
}
