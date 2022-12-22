/**
 * Makes the method run outside of Angular change detection
 *
 * <b>Requires ngZone implementation</b>
 * @since 4.0.0
 */
export function RunOutsideChangeDetection(targetClass: object, functionName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const ogMethod = descriptor.value;
  descriptor.value = function (...data: unknown[]): PropertyDescriptor {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!this.ngZone) {
      throw new Error('Class with "RunOutsideChangeDetection" decorator should have "ngZone" class property with "NgZone" class.');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.ngZone.runOutsideAngular(() => ogMethod.call(this, ...data));
  };
  return descriptor;
}
