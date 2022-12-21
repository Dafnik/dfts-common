import {Stopwatch} from '../helper/stopwatch';
import {toString} from '../helper/converter';

/**
 * Measures execution time for method call
 * @param unit The unit in which the execution time should be measured, defaults to <code>ms</code>
 * @since 4.0.0
 */
export function MeasureTime(
  unit: 'ms' | 's' | 'm' | 'h' = 'ms'
): (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const ogMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const watch = Stopwatch.createStarted();
      const result = ogMethod.apply(this, args);
      watch.stop();
      let time;
      switch (unit) {
        case 'ms':
          time = toString(watch.getTime()) + 'ms';
          break;
        case 's':
          time = toString(watch.getTimeInSeconds()) + 's';
          break;
        case 'm':
          time = toString(watch.getTimeInMinutes()) + 'm';
          break;
        case 'h':
          time = toString(watch.getTimeInHours()) + 'h';
          break;
      }
      console.log('Time for method "' + propertyKey + '" execution: "' + time + '"');
      return result;
    };
    return descriptor;
  };
}
