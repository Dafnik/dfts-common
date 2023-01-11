import {d_format} from './format-date';

describe('format-date', () => {
  it('format', () => {
    expect(d_format(new Date('2020-07-20'))).toBe('2020-07-20');
    expect(d_format(new Date('2020-01-01'))).toBe('2020-01-01');
    expect(d_format(new Date('2020-12-12'))).toBe('2020-12-12');
  });

  it('format with string', () => {
    expect(d_format('2020-07-20')).toBe('2020-07-20');
    expect(d_format('2020-01-01')).toBe('2020-01-01');
    expect(d_format('2020-12-12')).toBe('2020-12-12');
  });
});
