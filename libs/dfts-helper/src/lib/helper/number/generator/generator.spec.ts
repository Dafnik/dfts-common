import { n_generate_int, n_generate_float } from './generator';
import { a_containsDuplicates } from '../../array/contains-duplicates/contains-duplicates';

describe('number generator', () => {
  it('randomness number', () => {
    const test = [];
    for (let i = 0; i < 1000; i++) {
      test.push(n_generate_int(1, 10000000000000));
      test.push(n_generate_int(1, 10000000000000));
    }
    expect(a_containsDuplicates(test)).toBeFalsy();
  });

  it('int options', () => {
    for (let i = 0; i < 1000; i++) {
      const test = n_generate_int(2, 1000000000);
      if (test > 1000000001 || test < 2) {
        throw Error();
      }
    }
  });

  it('randomness float', () => {
    const test = [];
    for (let i = 0; i < 1000; i++) {
      test.push(n_generate_float(1, 10000000000000, 2));
      test.push(n_generate_float(1, 10000000000000, 2));
    }
    expect(a_containsDuplicates(test)).toBeFalsy();
  });

  it('float options', () => {
    for (let i = 0; i < 1000; i++) {
      const test = n_generate_float(2, 10000000000000, 2);
      if (test > 10000000000001 || test < 2) {
        throw Error();
      }
    }
  });
});
