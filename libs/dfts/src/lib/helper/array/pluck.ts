export function a_pluck<T, keyType extends keyof T>(array: T[], key: keyType): T[keyType][] {
  return array.map((item) => item[key]);
}
