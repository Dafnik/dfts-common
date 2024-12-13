import { a_chunk } from './chunk';

describe('a_chunk', () => {
  test('splits an evenly divisible array correctly', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const result = a_chunk(input, 2);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  test('handles chunk size of 1', () => {
    const input = [1, 2, 3];
    const result = a_chunk(input, 1);
    expect(result).toEqual([[1], [2], [3]]);
  });

  test('returns empty array when given an empty array', () => {
    const input: number[] = [];
    const result = a_chunk(input, 2);
    expect(result).toEqual([]);
  });

  test('returns one chunk if chunk size equals the entire array length', () => {
    const input = [1, 2, 3, 4];
    const result = a_chunk(input, 4);
    expect(result).toEqual([[1, 2, 3, 4]]);
  });

  test('last chunk may be smaller if array length is not divisible by chunk size', () => {
    const input = [1, 2, 3, 4, 5];
    const result = a_chunk(input, 2);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('handles chunk size larger than the array length', () => {
    const input = [1, 2, 3];
    const result = a_chunk(input, 10);
    expect(result).toEqual([[1, 2, 3]]);
  });

  test('works with different data types (strings)', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = a_chunk(input, 2);
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  test('works with mixed data types', () => {
    const input = [1, 'two', { three: 3 }, [4], null];
    const result = a_chunk(input, 2);
    expect(result).toEqual([[1, 'two'], [{ three: 3 }, [4]], [null]]);
  });

  test('handles a chunk size of 3', () => {
    const input = [1, 2, 3, 4, 5, 6, 7];
    const result = a_chunk(input, 3);
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  test('does not modify the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    a_chunk(input, 2);
    expect(input).toEqual(copy);
  });

  test('handles a large array efficiently', () => {
    const input = Array.from({ length: 1000 }, (_, i) => i + 1);
    const result = a_chunk(input, 100);
    expect(result.length).toBe(10);
    expect(result[0].length).toBe(100);
  });

  test('handles chunk size equal to 2 with odd length input', () => {
    const input = [1, 2, 3];
    const result = a_chunk(input, 2);
    expect(result).toEqual([[1, 2], [3]]);
  });

  test('handles chunk size equal to the first half of array length', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const result = a_chunk(input, 3);
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  test('works with a single-element array', () => {
    const input = [42];
    const result = a_chunk(input, 5);
    expect(result).toEqual([[42]]);
  });

  test('works with an array of booleans', () => {
    const input = [true, false, true, false, true];
    const result = a_chunk(input, 2);
    expect(result).toEqual([[true, false], [true, false], [true]]);
  });

  test('works with nested arrays as elements', () => {
    const input = [[1], [2], [3], [4]];
    const result = a_chunk(input, 2);
    expect(result).toEqual([
      [[1], [2]],
      [[3], [4]],
    ]);
  });

  test('handles chunk size of 1 on large input', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const result = a_chunk(input, 1);
    expect(result).toEqual([[1], [2], [3], [4], [5], [6]]);
  });

  test('returns the input if chunk size is equal to input length', () => {
    const input = [10, 20, 30];
    const result = a_chunk(input, 3);
    expect(result).toEqual([[10, 20, 30]]);
  });

  test('works with chunk size of 2 on an empty array', () => {
    const input: number[] = [];
    const result = a_chunk(input, 2);
    expect(result).toEqual([]);
  });

  test('handles large chunk size with large input', () => {
    const input = Array.from({ length: 20 }, (_, i) => i + 1);
    const result = a_chunk(input, 25);
    expect(result).toEqual([input]); // entire array as one chunk
  });
});
