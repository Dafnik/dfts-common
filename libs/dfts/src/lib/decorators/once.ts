/**
 * Allows method to be called only once
 */
export function Once(targetClass: Object, functionName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  let called = false;
  let returnValue: unknown;

  const ogMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    if (called) {
      return returnValue;
    }
    called = true;

    return (returnValue = ogMethod.apply(this, args));
  };
  return descriptor;
}
