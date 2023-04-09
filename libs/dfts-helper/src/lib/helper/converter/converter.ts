import {NullOr, UndefinedOr} from '../../types.js';

/**
 * Converts parameter from <code>T | null</code> to <code>T | undefined</code>
 * @template T
 * @param {T|undefined} value Value to convert
 * @return {T|null} Returns <code>T | undefined</code>
 */
export function c_nullToUndefined<T>(value: NullOr<T>): UndefinedOr<T> {
  if (value === null) {
    return undefined;
  }
  return value;
}

/**
 * Converts parameter from <code>T | undefined</code> to <code>T | null</code>
 * @template T
 * @param {T|undefined} value Value to convert
 * @return {T|null} Returns <code>T | null</code>
 */
export function c_undefinedToNull<T>(value: UndefinedOr<T>): NullOr<T> {
  if (value === undefined) {
    return null;
  }
  return value;
}

export function c_unchecked<SrcType, DstType>(ob: SrcType): DstType {
  return ob as unknown as DstType;
}
