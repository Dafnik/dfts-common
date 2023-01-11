export function a_containsDuplicates<T>(array: T[]): boolean {
  return array.length !== new Set(array).size;
}
