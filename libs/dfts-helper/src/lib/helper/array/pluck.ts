import { UndefinedOrNullOr } from '../../types';

/**
 * Extracts the values of a specific property from an array of objects.
 *
 * @template T
 * @template keyType
 * @param {T[]} array The array of objects to extract values from.
 * @param {keyType} key The key to extract from the objects.
 * @returns {T[keyType][]} An array of the extracted values.
 */
export function a_pluck<T, keyType extends keyof T>(array: T[], key: keyType): T[keyType][];
export function a_pluck<T, keyType extends keyof T>(array: UndefinedOrNullOr<T[]>, key: keyType): T[keyType][] | undefined {
  return array?.map((item) => item[key]);
}
