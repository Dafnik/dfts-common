import {s_upperCaseFirstLetter} from './transformers';

describe('transformer', () => {
  it('upperCaseFirstLetter', () => {
    expect(s_upperCaseFirstLetter(null)).toBe('');
    expect(s_upperCaseFirstLetter(undefined)).toBe('');
    expect(s_upperCaseFirstLetter('hello')).toBe('Hello');
    expect(s_upperCaseFirstLetter('goodbye')).toBe('Goodbye');
    expect(s_upperCaseFirstLetter('hello world')).toBe('Hello world');
    expect(s_upperCaseFirstLetter('the quick brown fox')).toBe('The quick brown fox');
    expect(s_upperCaseFirstLetter('1 hello')).toBe('1 hello');
    expect(s_upperCaseFirstLetter('$100')).toBe('$100');
    expect(s_upperCaseFirstLetter('hello world')).toBe('Hello world');
    expect(s_upperCaseFirstLetter('the quick brown fox')).toBe('The quick brown fox');
  });
});
