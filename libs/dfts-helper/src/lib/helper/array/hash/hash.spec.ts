import { a_hashFrom } from './hash';

describe('a_hashFrom', () => {
  test('returns first element if the string is empty', () => {
    const arr = ['a', 'b', 'c'];
    expect(a_hashFrom(arr, '')).toBe('a');
  });

  test('works with a single-character string', () => {
    const arr = ['x', 'y', 'z'];
    expect(a_hashFrom(arr, 'A')).toBeDefined();
  });

  test('works with a multi-character string', () => {
    const arr = ['apple', 'banana', 'cherry', 'date'];
    const result = a_hashFrom(arr, 'hello');
    expect(arr).toContain(result);
  });

  test('returns a consistent value for the same string', () => {
    const arr = [1, 2, 3, 4, 5];
    const str = 'consistent';
    const firstCall = a_hashFrom(arr, str);
    const secondCall = a_hashFrom(arr, str);
    expect(firstCall).toBe(secondCall);
  });

  test('different strings should produce different (not necessarily unique) results', () => {
    const arr = [1, 2, 3, 4, 5];
    const result1 = a_hashFrom(arr, 'abc');
    const result2 = a_hashFrom(arr, 'abd');
    // They might map to the same index by chance, but often won't.
    // This test just ensures the function runs without error.
    expect(arr).toContain(result1);
    expect(arr).toContain(result2);
  });

  test('works with non-string array elements (numbers)', () => {
    const arr = [10, 20, 30];
    const result = a_hashFrom(arr, 'test');
    expect([10, 20, 30]).toContain(result);
  });

  test('works with boolean elements', () => {
    const arr = [true, false];
    const result = a_hashFrom(arr, 'true-or-false');
    expect([true, false]).toContain(result);
  });

  test('works with objects', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = a_hashFrom(arr, 'object-test');
    expect(arr).toContain(result);
  });

  test('works with large arrays', () => {
    const arr = Array.from({ length: 100 }, (_, i) => i);
    const result = a_hashFrom(arr, 'large-array');
    expect(arr).toContain(result);
  });

  test('handles special characters in the string', () => {
    const arr = ['A', 'B', 'C', 'D'];
    const result = a_hashFrom(arr, '✨unicode✨');
    expect(arr).toContain(result);
  });

  test('handles strings that differ by only one character', () => {
    const arr = ['red', 'green', 'blue'];
    const result1 = a_hashFrom(arr, 'colorA');
    const result2 = a_hashFrom(arr, 'colorB');
    expect(arr).toContain(result1);
    expect(arr).toContain(result2);
    // Just ensuring both run without errors and produce valid outputs.
  });

  test('works with numeric strings', () => {
    const arr = [null, 'second', 'third'];
    const result = a_hashFrom(arr, '12345');
    expect([null, 'second', 'third']).toContain(result);
  });

  test('works with very long strings', () => {
    const arr = ['first', 'second', 'third'];
    const longStr = 'a'.repeat(10_000);
    const result = a_hashFrom(arr, longStr);
    expect(arr).toContain(result);
  });

  test('works with chunked strings', () => {
    const arr = ['first', 'second', 'third', 'fourth'];
    const str = 'abcd'.repeat(100); // a repeated pattern
    const result = a_hashFrom(arr, str);
    expect(arr).toContain(result);
  });

  test('works with a single-element array', () => {
    const arr = [42];
    const result = a_hashFrom(arr, 'anything');
    expect(result).toBe(42);
  });

  test('works with a prime-length array', () => {
    const arr = [true, false, null, undefined, 0, '', 'end'];
    // length: 7 (prime)
    const result = a_hashFrom(arr, 'prime-length-test');
    expect(arr).toContain(result);
  });

  test('handles an array of strings with repeated elements', () => {
    const arr = ['repeat', 'repeat', 'unique', 'repeat'];
    const result = a_hashFrom(arr, 'repetitive');
    expect(arr).toContain(result);
  });
});
