export function a_hashFrom<T>(array: T[], str: string): T {
  const length = str.length;
  if (length === 0) return array[0];

  let hash = 0;
  for (let i = 0; i < length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }

  return array[hash % array.length];
}
