import {c_nullToUndefined, c_undefinedToNull, c_unchecked} from './converter';

describe('c_undefinedToNull function', () => {
  it('c_undefinedToNull', () => {
    const test: string | undefined = undefined;
    expect(c_undefinedToNull(test)).toBeNull();
  });
  it('should convert an undefined value to null', () => {
    const result = c_undefinedToNull(undefined);
    expect(result).toEqual(null);
  });

  it('should return the original value if it is not undefined', () => {
    const result = c_undefinedToNull('hello');
    expect(result).toEqual('hello');
  });
  it('should return null if the input value is null', () => {
    const result = c_undefinedToNull(null);
    expect(result).toEqual(null);
  });

  it('should work correctly when the input value is an object', () => {
    const obj = {foo: 'bar'};
    const result = c_undefinedToNull(obj);
    expect(result).toEqual(obj);
  });

  it('should work correctly when the input value is an array', () => {
    const arr = [1, 2, 3];
    const result = c_undefinedToNull(arr);
    expect(result).toEqual(arr);
  });
});

describe('c_nullToUndefined function', () => {
  it('c_nullToUndefined', () => {
    const test: string | null = null;
    expect(c_nullToUndefined(test)).toBeUndefined();
  });
  it('should convert a null value to undefined', () => {
    const result = c_nullToUndefined(null);
    expect(result).toEqual(undefined);
  });

  it('should return the original value if it is not null', () => {
    const result = c_nullToUndefined('hello');
    expect(result).toEqual('hello');
  });

  it('should return undefined if the input value is undefined', () => {
    const result = c_nullToUndefined(undefined);
    expect(result).toEqual(undefined);
  });

  it('should work correctly when the input value is an object', () => {
    const obj = {foo: 'bar'};
    const result = c_nullToUndefined(obj);
    expect(result).toEqual(obj);
  });

  it('should work correctly when the input value is an array', () => {
    const arr = [1, 2, 3];
    const result = c_nullToUndefined(arr);
    expect(result).toEqual(arr);
  });

  it('unchecked cast', () => {
    const test = '';
    expect(c_unchecked<string, boolean>(test)).toBeDefined();
  });
  it('unchecked cast array', () => {
    const arr = [1, 2, 3];
    const result = c_unchecked(arr);
    expect(result).toEqual(arr);
  });
});
