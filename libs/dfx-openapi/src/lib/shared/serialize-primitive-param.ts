/**
 * Serialize primitive param values
 */
export function serializePrimitiveParam(name: string, value: string, options?: { allowReserved?: boolean }): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'object') {
    throw new Error('Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.');
  }
  return `${name}=${options?.allowReserved === true ? value : encodeURIComponent(value)}`;
}
