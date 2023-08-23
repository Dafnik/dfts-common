import {Stopwatch} from '../../helper/stopwatch/stopwatch';
import {s_from} from '../../helper/string/from/from';

/**
 * Measures execution time for method call
 * @param unit The unit in which the execution time should be measured, defaults to <code>ms</code>
 * @since 4.0.0
 */
export function MeasureTime(
  unit: 'ms' | 's' | 'm' | 'h' = 'ms',
): (target: object, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const ogMethod = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const watch = Stopwatch.createStarted();
      const result = ogMethod.apply(this, args);
      watch.stop();
      let time;
      switch (unit) {
        case 'ms':
          time = s_from(watch.getTime()) + 'ms';
          break;
        case 's':
          time = s_from(watch.getTimeInSeconds()) + 's';
          break;
        case 'm':
          time = s_from(watch.getTimeInMinutes()) + 'm';
          break;
        case 'h':
          time = s_from(watch.getTimeInHours()) + 'h';
          break;
      }
      console.log('Time for method "' + propertyKey + '" execution: "' + time + '"');
      return result;
    };
    return descriptor;
  };
}
