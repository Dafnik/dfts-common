import { QuerySerializerOptions } from './query-serializer-options';
import { serializeArrayParam } from './serialize-array-param';
import { serializeObjectParam } from './serialize-object-param';
import { serializePrimitiveParam } from './serialize-primitive-param';

/**
 * Serialize query params to string
 */
export function createQuerySerializer<T = unknown>(options?: QuerySerializerOptions): (queryParams: T) => string {
  return function querySerializer(queryParams) {
    const search = [];
    if (queryParams && typeof queryParams === 'object') {
      for (const name in queryParams) {
        const value = queryParams[name];
        if (value === undefined || value === null) {
          continue;
        }
        if (Array.isArray(value)) {
          if (value.length === 0) {
            continue;
          }
          search.push(
            serializeArrayParam(name, value, {
              style: 'form',
              explode: true,
              ...options?.array,
              allowReserved: options?.allowReserved || false,
            }),
          );
          continue;
        }
        if (typeof value === 'object') {
          search.push(
            // @ts-expect-error Type issue
            serializeObjectParam(name, value, {
              style: 'deepObject',
              explode: true,
              ...options?.object,
              allowReserved: options?.allowReserved || false,
            }),
          );
          continue;
        }

        // @ts-expect-error Type issue
        search.push(serializePrimitiveParam(name, value, options));
      }
    }
    return search.join('&');
  };
}
