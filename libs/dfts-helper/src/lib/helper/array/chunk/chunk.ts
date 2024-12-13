export function a_chunk<T>(input: T[], chunkSize: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < input.length; i += chunkSize) {
    result.push(input.slice(i, i + chunkSize));
  }

  return result;
}
