/**
 * Makes the method run outside of Angular change detection
 *
 * <b>Requires ngZone implementation</b>
 * @since 4.0.0
 */
export function RunOutsideChangeDetection(targetClass: Object, functionName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const ogMethod = descriptor.value;
  descriptor.value = function (...data: any[]): Function {
    // @ts-ignore
    if (!this.ngZone) {
      throw new Error('Class with "RunOutsideChangeDetection" decorator should have "ngZone" class property with "NgZone" class.');
    }
    // @ts-ignore
    return this.ngZone.runOutsideAngular(() => ogMethod.call(this, ...data));
  };
  return descriptor;
}
